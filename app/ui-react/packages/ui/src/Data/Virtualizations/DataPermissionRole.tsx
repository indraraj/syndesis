import {
  Chip,
  ChipGroup,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  FormGroup,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { CaretDownIcon, OutlinedTrashAltIcon } from '@patternfly/react-icons';
import * as React from 'react';
import './DataPermissionModel.css';

export interface IDataPermissionRoleProps {
  index: number;
  i18nModelDataRole: string;
  i18nModelPermissionType: string;
  removePermissionRole: (key: number) => void;
}

export const DataPermissionRole: React.FunctionComponent<IDataPermissionRoleProps> = props => {
  const [isRoleOpen, setIsRoleOpen] = React.useState<boolean>(false);
  const [isPermissionOpen, setIsPermissionOpen] = React.useState<boolean>(
    false
  );
  const [role, setRole] = React.useState<string>('Developer');
  const [chips, setChips] = React.useState<string[]>([]);

  const onRoleToggle = (isOpen: boolean) => {
    setIsRoleOpen(isOpen);
  };
  const onRoleSelect = (event: any) => {
    setIsRoleOpen(!isRoleOpen);
    const selected = event.target.textContent;
    setRole(selected);
    onRoleFocus();
  };
  const onRoleFocus = () => {
    const element = document.getElementById(`toggle-id-role-${props.index}`);
    // tslint:disable-next-line: no-unused-expression
    element && element.focus();
  };

  const onPermissionToggle = (isOpen: boolean) => {
    setIsPermissionOpen(isOpen);
  };
  const onPermissionSelect = (event: any) => {
    setIsPermissionOpen(!isPermissionOpen);
    const selected = event.target.textContent;
    const alreadySelected = chips.indexOf(selected) !== -1;
    if (!alreadySelected) {
      const copyOfChipArray = chips.slice();
      copyOfChipArray.push(selected);
      setChips(copyOfChipArray);
    }
    onPermissionFocus();
  };
  const onPermissionFocus = () => {
    const element = document.getElementById(
      `toggle-id-permission-${props.index}`
    );
    // tslint:disable-next-line: no-unused-expression
    element && element.focus();
  };



  // in future may fetch from backend
  const dropdownRoleItems = [
    <DropdownItem key="link">User</DropdownItem>,
    <DropdownItem key="link">Developer</DropdownItem>,
    <DropdownItem key="link">Admin</DropdownItem>,
  ];
  // in future may fetch from backend
  const dropdownPermissionItems = [
    <DropdownItem key="link">Create</DropdownItem>,
    <DropdownItem key="link">Read</DropdownItem>,
    <DropdownItem key="link">Update</DropdownItem>,
    <DropdownItem key="link">Delete</DropdownItem>,
  ];

  const deleteItem = (id: string) => {
    const copyOfChipArray = chips;
    const index = copyOfChipArray.indexOf(id);
    if (index !== -1) {
      copyOfChipArray.splice(index, 1);
      setChips(copyOfChipArray);
    }
  };

  return (
    <>
      <Split gutter="md">
        <SplitItem isFilled={true} className={'data-permission-model_divider'}>
          <Divider />
        </SplitItem>
        <SplitItem>
          <OutlinedTrashAltIcon
            // tslint:disable-next-line: jsx-no-lambda
            onClick={() => props.removePermissionRole(props.index)}
          />
        </SplitItem>
      </Split>
      <div>
        <div>
          <FormGroup
            label={props.i18nModelDataRole}
            isRequired={true}
            fieldId="simple-form-name"
            className={'data-permission-model_form_group'}
          >
            <Dropdown
              className={
                'data-permission-model_dropdown data-permission-model_role_dropdown'
              }
              onSelect={onRoleSelect}
              toggle={
                <DropdownToggle
                  id={`toggle-id-role-${props.index}`}
                  onToggle={onRoleToggle}
                >
                  {role}
                </DropdownToggle>
              }
              isOpen={isRoleOpen}
              dropdownItems={dropdownRoleItems}
              autoFocus={false}
            />
          </FormGroup>
          <FormGroup
            label={props.i18nModelPermissionType}
            isRequired={true}
            fieldId="simple-form-email"
            className={'data-permission-model_form_group'}
          >
            <Dropdown
              className={
                'data-permission-model_dropdown data-permission-model_permission_dropdown'
              }
              onSelect={onPermissionSelect}
              toggle={
                <DropdownToggle
                  id={`toggle-id-permission-${props.index}`}
                  onToggle={onPermissionToggle}
                  iconComponent={CaretDownIcon}
                >
                  {chips.length < 1 ? (
                    'Choose Type'
                  ) : (
                    <ChipGroup>
                      {chips.map(currentChip => (
                        <Chip
                          key={currentChip}
                          // tslint:disable-next-line: jsx-no-lambda
                          onClick={() => deleteItem(currentChip)}
                        >
                          {currentChip}
                        </Chip>
                      ))}
                    </ChipGroup>
                  )}
                </DropdownToggle>
              }
              isOpen={isPermissionOpen}
              dropdownItems={dropdownPermissionItems}
            />
          </FormGroup>
        </div>
      </div>
    </>
  );
};
