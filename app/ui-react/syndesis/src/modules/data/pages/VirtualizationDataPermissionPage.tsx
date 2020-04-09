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
// import { css } from '@patternfly/react-styles';
import { Breadcrumb, PageSection } from '@syndesis/ui';
import { useRouteData } from '@syndesis/utils';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  IVirtualizationEditorPageRouteParams,
  IVirtualizationEditorPageRouteState,
} from '.';
import resolvers from '../../resolvers';
import './VirtualizationDataPermissionPage.css'

export const VirtualizationDataPermissionPage: React.FunctionComponent = () => {
  const { t } = useTranslation(['data', 'shared']);
  /**
   * Hook to obtain route params and history.
   */
  const { params, state } = useRouteData<
    IVirtualizationEditorPageRouteParams,
    IVirtualizationEditorPageRouteState
  >();

  const [isMultiSelectOpen, setIsMultiSelectOpen] = React.useState<boolean>(
    false
  );
  const [isSetPermissionOpen, setIsSetPermissionOpen] = React.useState<boolean>(
    false
  );

  const [perPage, setPerPage] = React.useState<number>(6);
  const [page, setPage] = React.useState<number>(1);

  // tslint:disable-next-line: no-console
  console.log('params', params);
  // tslint:disable-next-line: no-console
  console.log('state', state);

  const virtualization = state.virtualization;
  const { resource: viewDetails } = useViewDefinitionDescriptors(
    virtualization.name,
    true
  );
  // tslint:disable-next-line: no-console
  console.log('views', viewDetails);

  const multiSelectToggle = (isOpen: boolean) => {
    setIsMultiSelectOpen(isOpen);
  };

  const onMultiSelect = () => {
    setIsMultiSelectOpen(!isMultiSelectOpen);
  };

  const onToggle = (isOpen: boolean) => {
    setIsSetPermissionOpen(isOpen);
  };
  const onSelect = () => {
    setIsSetPermissionOpen(!isSetPermissionOpen);
    onFocus();
  };
  const onFocus = () => {
    const element = document.getElementById('toggle-id-4');
    // tslint:disable-next-line: no-unused-expression
    element && element.focus();
  };

  const onSetPage = (event: any, pageNumber: number) => {
    setPage(pageNumber);
  };

  const onPerPageSelect = (event: any, perPageNumber: number) => {
    setPerPage(perPageNumber);
  };

  const multiSelectDropdownItems = [
    <DropdownItem key="link">Select none</DropdownItem>,
    <DropdownItem key="action">Select page (6 items)</DropdownItem>,
    <DropdownItem key="disabled link">Select all (24 items)</DropdownItem>,
  ];

  const dropdownItems = [
    <DropdownItem key="disabled action" isDisabled={true} component="button">
      <i>Select view first to set more permission</i>
    </DropdownItem>,
    <DropdownSeparator key="separator" />,
    <DropdownItem key="separated link">Any authentication</DropdownItem>,
    <DropdownItem key="separated action" component="button">
      Developer
    </DropdownItem>,
    <DropdownItem key="separated" component="button">
      Admin
    </DropdownItem>,
    <DropdownItem key="separated new" component="button">
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
        <span>Data Permission</span>
      </Breadcrumb>
      <PageSection variant={'light'}>
        <h1 className="pf-c-title pf-m-xl">
          Set data permission for data virtualization
        </h1>
      </PageSection>
      <PageSection>
        <PageSection className={'virtualization-data-permission-page-toolbar_section'}>
          <Toolbar
            className="pf-l-toolbar pf-u-justify-content-space-between pf-u-mx-xl pf-u-my-md virtualization-data-permission-page-toolbar"
          >
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
                      id="toggle-id-4"
                    >
                      Set data permission
                    </DropdownToggle>
                  }
                  isOpen={isSetPermissionOpen}
                  dropdownItems={dropdownItems}
                />
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup>
              <Pagination
                itemCount={24}
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
          <DataListItem aria-labelledby="check-action-item2">
            <DataListItemRow>
              <DataListCheck
                aria-labelledby="check-action-item2"
                name="check-action-check2"
                checked={true}
                className={'virtualization-data-permission-page-list_heading'}
              />
              <DataListItemCells
                dataListCells={[
                  <DataListCell width={1} key="width 2">
                    <Text
                      component={TextVariants.h3}
                      className={'virtualization-data-permission-page-list_headingText'}
                    >
                      View
                    </Text>
                  </DataListCell>,
                  <DataListCell width={5} key="width 5">
                    <Text
                      component={TextVariants.h2}
                      className={'virtualization-data-permission-page-list_headingText'}
                    >
                      Data Permission
                    </Text>
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
          {viewDetails.map(view => {
            return (
              <DataListItem aria-labelledby="check-action-item2" key={view.id}>
                <DataListItemRow>
                  <DataListCheck
                    aria-labelledby="check-action-item2"
                    name="check-action-check2"
                    checked={true}
                  />
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell width={1} key="width 2">
                        <span id="check-action-item2">{view.name}</span>
                      </DataListCell>,
                      <DataListCell width={5} key="width 5">
                        <Badge
                          key={1}
                          isRead={true}
                          className={'virtualization-data-permission-page-permission_badge'}
                        >
                          Developer:Read/Edit/Delete <CloseIcon />
                        </Badge>
                        <Badge
                          key={1}
                          isRead={true}
                          className={'virtualization-data-permission-page-permission_badge'}
                        >
                          Admin:Execute <CloseIcon />
                        </Badge>
                      </DataListCell>,
                    ]}
                  />
                  <DataListAction
                    // className={css(DataListActionVisibility.hiddenOnLg)}
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
      </PageSection>
    </>
  );
};
