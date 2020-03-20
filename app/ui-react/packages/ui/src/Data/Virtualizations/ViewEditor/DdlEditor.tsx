import {
  Alert,
  AlertActionCloseButton,
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardFooter,
  Grid,
  GridItem,
  Modal,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import { PlusIcon } from '@patternfly/react-icons';
import * as React from 'react';
import { ConnectionTreeComponent, DataPermissionModel } from '.';
import { Loader, PageSection } from '../../../Layout';
import { ITextEditor, TextEditor } from '../../../Shared';
import './DdlEditor.css';
import { dvLanguageMode, loadDvMime } from './DvAutocomplete';

export interface IViewEditValidationResult {
  message: string;
  type: 'danger' | 'success';
}

export interface ITableInfo {
  name: string;
  columnNames: string[];
}

export interface IDdlEditorProps {
  viewDdl: string;

  /**
   * The localized text for the cursor Column.
   */
  i18nCursorColumn: string;

  /**
   * The localized text for the cursor Line.
   */
  i18nCursorLine: string;

  /**
   * The localized text for the DDL text placeholder when no content exists.
   */
  i18nDdlTextPlaceholder: string;

  /**
   * The localized text for the done button.
   */
  i18nDoneLabel: string;

  /**
   * The localized text for the save button.
   */
  i18nSaveLabel: string;

  /**
   * The localized text for the title
   */
  i18nTitle: string;

  /**
   * The localized text for the MetaData tree title
   */
  i18nMetadataTitle: string;

  /**
   * The localized text for the Loading
   */
  i18nLoading: string;

  /**
   * Preview Data Table state
   */
  previewExpanded: boolean;

  /**
   * The localized text for the validate results message title
   */
  i18nValidationResultsTitle: string;

  i18nAddDataPermission: string;

  i18nModelAddPermissionRole: string;
  i18nModelTitle: string;
  i18nModelDataRole: string;
  i18nModelPermissionType: string;
  i18nModelConditionExp: string;

  /**
   * `true` if the validation message is to be shown
   */
  showValidationMessage: boolean;

  /**
   * `true` if save is in progress.
   */
  isSaving: boolean;

  /**
   * View validationResults
   */
  validationResults: IViewEditValidationResult[];

  /**
   * Source table-columns for code completion
   */
  sourceTableInfos: ITableInfo[];

  /**
   * Unformatted Source info
   */
  sourceInfo: any;

  /**
   * The callback for closing the validation message
   */
  onCloseValidationMessage: () => void;

  /**
   * The callback for when the done button is clicked
   */
  onFinish: () => void;

  /**
   * The callback for when the save button is clicked
   * @param ddl the text area ddl
   * @returns `true` if saving the DDL was successful
   */
  onSave: (ddl: string) => Promise<boolean>;

  /**
   * @param dirty `true` if the editor has unsaved changes
   */
  setDirty: (dirty: boolean) => void;
}

const getMetadataTree = (sourceInfo: any): Map<string, any> => {
  const treeInfo = new Map<string, any>();

  for (const connection of sourceInfo) {
    treeInfo.set(connection.name, connection.tables);
  }
  return treeInfo;
};

export const DdlEditor: React.FunctionComponent<IDdlEditorProps> = props => {
  const [ddlValue, setDdlValue] = React.useState(props.viewDdl);
  const [initialDdlValue] = React.useState(props.viewDdl);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [savedValue, setSavedValue] = React.useState(props.viewDdl);
  const [keywordsRegistered, setKeywordsRegistered] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = React.useState(
    `( ${props.i18nCursorLine} ?, ${props.i18nCursorColumn} ? )`
  );

  const handleCloseValidationMessage = () => {
    props.onCloseValidationMessage();
  };

  const handleEditorDidMount = (editor: ITextEditor) => {
    editor.on('cursorActivity', cm => {
      const pos = editor.getCursor();
      setCursorPosition(getCursorText(pos));
    });
  };

  const getCursorText = (pos: any) => {
    return `( ${props.i18nCursorLine} ${pos.line + 1}, ${
      props.i18nCursorColumn
    } ${pos.ch + 1} )`;
  };

  const handleDdlChange = (editor: ITextEditor, data: any, value: string) => {
    setDdlValue(value);
    handleCloseValidationMessage();

    const dirty = value !== savedValue;

    if (dirty !== hasChanges) {
      setHasChanges(dirty);
      props.setDirty(dirty);
    }
  };

  const handleFinish = () => {
    props.onFinish();
  };

  const handleSave = async () => {
    const saved = await props.onSave(ddlValue);
    if (saved) {
      setSavedValue(ddlValue);
      setHasChanges(false);
      props.setDirty(false);
    }
  };

  /**
   * reformats the tableInfo into the format expected by hintOptions
   * Example -
   *   tables: {
   *     countries: ['name', 'population', 'size'],
   *     users: ['name', 'score', 'birthDate'],
   *   }
   * @param tableInfos the table infos
   */
  const getHintOptions = (tableInfos: ITableInfo[]) => {
    if (!keywordsRegistered) {
      loadDvMime();
      setKeywordsRegistered(true);
    }

    const result = { tables: {} };

    for (const tableInfo of tableInfos) {
      result.tables[tableInfo.name] = tableInfo.columnNames;
    }
    return result;
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const editorOptions = {
    autoCloseBrackets: true,
    autofocus: true,
    extraKeys: { 'Ctrl-Space': 'autocomplete' },
    gutters: ['CodeMirror-lint-markers'],
    hintOptions: getHintOptions(props.sourceTableInfos),
    indentWithTabs: true,
    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,
    mode: dvLanguageMode,
    placeholder: props.i18nDdlTextPlaceholder,
    readOnly: false,
    showCursorWhenSelecting: true,
    styleActiveLine: true,
    tabSize: 2,
  };

  const metadataTree = getMetadataTree(props.sourceInfo);

  return (
    <Grid style={{ flexGrow: 1 }}>
      <GridItem span={3}>
        <PageSection isFilled={true} variant={'light'} className={'ddl-editor'}>
          <Title headingLevel="h5" size="lg">
            {props.i18nMetadataTitle}
          </Title>
          <div
            className={
              props.previewExpanded
                ? 'ddl-editor_metatree_table ddl-editor_metatree_table_scroll'
                : 'ddl-editor_metatree_table'
            }
          >
            <ConnectionTreeComponent
              metadataTree={metadataTree}
              i18nLoading={props.i18nLoading}
            />
          </div>
        </PageSection>
      </GridItem>
      <GridItem span={9}>
        <PageSection isFilled={true} variant={'light'} className={'ddl-editor'}>
          <Title headingLevel="h5" size="lg">
            {props.i18nTitle}
            <Button
              variant="link"
              icon={<PlusIcon />}
              onClick={handleModalToggle}
            >
              {props.i18nAddDataPermission}
            </Button>
          </Title>
          {props.showValidationMessage
            ? props.validationResults.map((e, idx) => (
                <Alert
                  key={idx}
                  variant={e.type}
                  isInline={true}
                  title={props.i18nValidationResultsTitle}
                  action={
                    <AlertActionCloseButton
                      onClose={handleCloseValidationMessage}
                    />
                  }
                >
                  {e.message}
                </Alert>
              ))
            : null}
          <TextContent>
            <Text className={'ddl-editor-cursor-position-text'}>
              {cursorPosition}
            </Text>
          </TextContent>
          <Modal
            isLarge={true}
            title={props.i18nModelTitle}
            isOpen={isModalOpen}
            onClose={handleModalToggle}
            actions={[
              <Button
                key="confirm"
                variant="primary"
                onClick={handleModalToggle}
              >
                {props.i18nSaveLabel}
              </Button>,
              <Button key="cancel" variant="link" onClick={handleModalToggle}>
                Cancel
              </Button>,
            ]}
            isFooterLeftAligned={true}
          >
            {
              <DataPermissionModel
                i18nModelAddPermissionRole={props.i18nModelAddPermissionRole}
                i18nModelDataRole={props.i18nModelDataRole}
                i18nModelPermissionType={props.i18nModelPermissionType}
                i18nModelConditionExp={props.i18nModelConditionExp}
              />
            }
          </Modal>
          <Card>
            <CardBody className={'ddl-editor__card-body'}>
              <TextEditor
                value={initialDdlValue}
                options={editorOptions}
                onChange={handleDdlChange}
                editorDidMount={handleEditorDidMount}
              />
            </CardBody>
            <CardFooter className={'ddl-editor__card-footer'}>
              <Button
                data-testid={'ddl-editor-done-button'}
                className="ddl-editor__button"
                isDisabled={props.isSaving}
                variant={ButtonVariant.secondary}
                onClick={handleFinish}
              >
                {props.i18nDoneLabel}
              </Button>
              <Button
                data-testid={'ddl-editor-save-button'}
                className="ddl-editor__button"
                isDisabled={props.isSaving || !hasChanges}
                variant={ButtonVariant.primary}
                onClick={handleSave}
              >
                {props.isSaving ? <Loader size={'xs'} inline={true} /> : null}
                {props.i18nSaveLabel}
              </Button>
            </CardFooter>
          </Card>
        </PageSection>
      </GridItem>
    </Grid>
  );
};
