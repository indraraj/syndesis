import {
  Badge,
  DataList,
  DataListAction,
  DataListCell,
  DataListCheck,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownToggle,
  DropdownToggleCheckbox,
  Pagination,
  Text,
  TextVariants,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  CaretDownIcon,
  CloseIcon,
  PencilAltIcon,
} from '@patternfly/react-icons';
import { useViewDefinitionDescriptors } from '@syndesis/api';
import { ViewDefinitionDescriptor } from '@syndesis/models';
import { Breadcrumb, PageSection, ViewListSkeleton } from '@syndesis/ui';
import { useRouteData, WithLoader } from '@syndesis/utils';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  IVirtualizationEditorPageRouteParams,
  IVirtualizationEditorPageRouteState,
} from '.';
import { ApiError } from '../../../shared';
import resolvers from '../../resolvers';
import './VirtualizationDataPermissionPage.css';

export const VirtualizationDataPermissionPage: React.FunctionComponent = () => {
  /**
   * Hook to obtain route params and history.
   */
  const { state } = useRouteData<
    IVirtualizationEditorPageRouteParams,
    IVirtualizationEditorPageRouteState
  >();

  /**
   * Hook to handle localization.
   */
  const { t } = useTranslation(['data', 'shared']);

  /**
   * React useState Hook to handle state in component.
   */
  const [isMultiSelectOpen, setIsMultiSelectOpen] = React.useState<boolean>(
    false
  );
  const [isSetPermissionOpen, setIsSetPermissionOpen] = React.useState<boolean>(
    false
  );

  const [perPage, setPerPage] = React.useState<number>(20);
  const [page, setPage] = React.useState<number>(1);
  const [viewDetailsPerPage, setViewDetailsPerPage] = React.useState<
    ViewDefinitionDescriptor[]
  >([]);

  const [itemSelected, setItemSelected] = React.useState<string[]>([]);

  const virtualization = state.virtualization;

  /**
   * useViewDefinitionDescriptors Hook to get the Virtulization view details.
   */
  const {
    resource: viewDetails,
    error: viewDefinitionDescriptorsError,
    hasData: hasViewDefinitionDescriptors,
  } = useViewDefinitionDescriptors(virtualization.name, true);

  /**
   * Multi view select handling.
   */
  const multiSelectToggle = (isOpen: boolean) => {
    setIsMultiSelectOpen(isOpen);
  };

  const onMultiSelect = () => {
    setIsMultiSelectOpen(!isMultiSelectOpen);
  };

  const onSetPage = (event: any, pageNumber: number) => {
    setPage(pageNumber);
  };

  const onPerPageSelect = (event: any, perPageNumber: number) => {
    setPerPage(perPageNumber);
  };

  React.useEffect(() => {
    const initialVal = perPage * (page - 1);
    const pageViewList = viewDetails.slice(initialVal, initialVal + perPage);

    setViewDetailsPerPage(pageViewList);
  }, [page, viewDetails, perPage]);

  const onSelectedViewChange = (checked: boolean, event: any, view: string) => {
    const itemSelectedCopy = [...itemSelected];
    itemSelectedCopy.push(view);
    setItemSelected(itemSelectedCopy);
  };

  const clearViewSelection = () => {
    setItemSelected([]);
  };

  const selectPageViews = () => {
    const selectedViews: string[] = [];
    for (const view of viewDetailsPerPage) {
      selectedViews.push(view.name);
    }
    setItemSelected(selectedViews);
  };

  const selectAllViews = () => {
    const selectedViews: string[] = [];
    for (const view of viewDetails) {
      selectedViews.push(view.name);
    }
    setItemSelected(selectedViews);
  };

  /**
   * set data permission handling.
   */
  const onToggle = (isOpen: boolean) => {
    setIsSetPermissionOpen(isOpen);
  };
  const onSelect = () => {
    setIsSetPermissionOpen(!isSetPermissionOpen);
    onFocus();
  };
  const onFocus = () => {
    const element = document.getElementById('set-Data-permission');
    // tslint:disable-next-line: no-unused-expression
    element && element.focus();
  };

  const multiSelectDropdownItems = [
    <DropdownItem key="select-none" onClick={clearViewSelection}>
      {t('permissionSelectNone')}
    </DropdownItem>,
    <DropdownItem key="select-page-list" onClick={selectPageViews}>
      {t('permissionSelectPage', {
        pageListLenght: viewDetailsPerPage.length,
      })}
    </DropdownItem>,
    <DropdownItem key="-select-all-list" onClick={selectAllViews}>
      {t('permissionSelectPage', {
        allListLength: viewDetails.length,
      })}
    </DropdownItem>,
  ];

  const setPermissionDropdownItems = [
    <DropdownItem key="disabled-5action" isDisabled={true} component="button">
      <i>Select view first to set more permission</i>
    </DropdownItem>,
    <DropdownSeparator key="separator5" />,
    <DropdownItem key="separated-5link">Any authentication</DropdownItem>,
    <DropdownItem key="separated-5action" component="button">
      Developer
    </DropdownItem>,
    <DropdownItem key="separated-5adm" component="button">
      Admin
    </DropdownItem>,
    <DropdownItem key="separated-5new" component="button">
      User
    </DropdownItem>,
  ];
  return (
    <>
      <Breadcrumb>
        <Link
          data-testid={'virtualization-create-page-home-link'}
          to={resolvers.dashboard.root()}
        >
          {t('shared:Home')}
        </Link>
        <Link
          data-testid={'virtualization-create-page-virtualizations-link'}
          to={resolvers.data.root()}
        >
          {t('shared:Data')}
        </Link>
  <span>{t('permissionNav')}</span>
      </Breadcrumb>
      <PageSection variant={'light'}>
        <h1 className="pf-c-title pf-m-xl">
        {t('permissionHeading')}
        </h1>
      </PageSection>
      <PageSection>
        <>
          <WithLoader
            error={viewDefinitionDescriptorsError !== false}
            loading={
              virtualization.name === '' || !hasViewDefinitionDescriptors
            }
            loaderChildren={<ViewListSkeleton width={800} />}
            errorChildren={
              <ApiError error={viewDefinitionDescriptorsError as Error} />
            }
          >
            {() => (
              <>
                <PageSection
                  className={
                    'virtualization-data-permission-page-toolbar_section'
                  }
                >
                  <Toolbar className="pf-l-toolbar pf-u-justify-content-space-between pf-u-mx-xl pf-u-my-md virtualization-data-permission-page-toolbar">
                    <ToolbarGroup>
                      <ToolbarItem className="pf-u-mr-xl">
                        <Dropdown
                          onSelect={onMultiSelect}
                          toggle={
                            <DropdownToggle
                              id="stacked-example-toggle"
                              splitButtonItems={[
                                <DropdownToggleCheckbox
                                  id="example-checkbox-1"
                                  key="split-checkbox"
                                  aria-label="Select all"
                                />,
                              ]}
                              onToggle={multiSelectToggle}
                            />
                          }
                          isOpen={isMultiSelectOpen}
                          dropdownItems={multiSelectDropdownItems}
                        />
                      </ToolbarItem>

                      <ToolbarItem className="pf-u-mr-md">
                        <Dropdown
                          onSelect={onSelect}
                          toggle={
                            <DropdownToggle
                              onToggle={onToggle}
                              iconComponent={CaretDownIcon}
                              isPrimary={true}
                              id="set-Data-permission"
                            >
                              {t('permissionSetButton')}
                            </DropdownToggle>
                          }
                          isOpen={isSetPermissionOpen}
                          dropdownItems={setPermissionDropdownItems}
                        />
                      </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup>
                      <Pagination
                        itemCount={viewDetails.length}
                        perPage={perPage}
                        page={page}
                        onSetPage={onSetPage}
                        widgetId="pagination-options-menu-top"
                        onPerPageSelect={onPerPageSelect}
                      />
                    </ToolbarGroup>
                  </Toolbar>
                </PageSection>
                <DataList aria-label="ds">
                  <DataListItem aria-labelledby="check-action-heading">
                    <DataListItemRow>
                      <DataListCheck
                        aria-labelledby="check-action-item2"
                        name="check-action-check2"
                        checked={false}
                        className={
                          'virtualization-data-permission-page-list_heading'
                        }
                      />
                      <DataListItemCells
                        dataListCells={[
                          <DataListCell width={1} key="width-2">
                            <Text
                              component={TextVariants.h3}
                              className={
                                'virtualization-data-permission-page-list_headingText'
                              }
                            >
                              {t('View')}
                            </Text>
                          </DataListCell>,
                          <DataListCell width={5} key="width-5">
                            <Text
                              component={TextVariants.h2}
                              className={
                                'virtualization-data-permission-page-list_headingText'
                              }
                            >
                              {t('permissionNav')}
                            </Text>
                          </DataListCell>,
                        ]}
                      />
                    </DataListItemRow>
                  </DataListItem>
                  {viewDetailsPerPage.map(view => {
                    return (
                      <DataListItem
                        aria-labelledby="check-action-item2"
                        key={view.id}
                      >
                        <DataListItemRow>
                          <DataListCheck
                            aria-labelledby="check-action-item2"
                            name="check-action-check2"
                            checked={itemSelected.includes(view.name)}
                            onChange={(checked: boolean, event: any) =>
                              onSelectedViewChange(checked, event, view.name)
                            }
                          />
                          <DataListItemCells
                            dataListCells={[
                              <DataListCell width={1} key={view.name}>
                                <span id="check-action-item2">{view.name}</span>
                              </DataListCell>,
                              <DataListCell width={5} key={`temp-${view.name}`}>
                                <Badge
                                  key={`temp2-${view.name}`}
                                  isRead={true}
                                  className={
                                    'virtualization-data-permission-page-permission_badge'
                                  }
                                >
                                  Developer:Read/Edit/Delete <CloseIcon />
                                </Badge>
                                <Badge
                                  key={`temp3-${view.name}`}
                                  isRead={true}
                                  className={
                                    'virtualization-data-permission-page-permission_badge'
                                  }
                                >
                                  Admin:Execute <CloseIcon />
                                </Badge>
                              </DataListCell>,
                            ]}
                          />
                          <DataListAction
                            aria-labelledby="check-action-item2 check-action-action2"
                            id="check-action-action2"
                            aria-label="Actions"
                          >
                            <PencilAltIcon />
                          </DataListAction>
                        </DataListItemRow>
                      </DataListItem>
                    );
                  })}
                </DataList>
              </>
            )}
          </WithLoader>
        </>
      </PageSection>
    </>
  );
};
