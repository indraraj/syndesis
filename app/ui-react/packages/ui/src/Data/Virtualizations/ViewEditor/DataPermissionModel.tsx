import { Button, Form } from '@patternfly/react-core';
import * as React from 'react';
import { DataPermissionRole } from '.';
import './DataPermissionModel.css';

export interface IDataPermissionModelProps {
  i18nModelAddPermissionRole: string;
  i18nModelDataRole: string;
  i18nModelPermissionType: string;
  i18nModelConditionExp: string;
}

export const DataPermissionModel: React.FunctionComponent<IDataPermissionModelProps> = props => {
  const removePermissionRole = (key: number) => {
    const copyOfPermissionRole = [...permissionRole];
    // copyOfPermissionRole.splice(key, 1);
    setPermissionRole(copyOfPermissionRole);
  };
  const [permissionRole, setPermissionRole] = React.useState<JSX.Element[]>([
    <div key={0}>
      <DataPermissionRole
        index={0}
        i18nModelDataRole={props.i18nModelDataRole}
        i18nModelPermissionType={props.i18nModelPermissionType}
        i18nModelConditionExp={props.i18nModelConditionExp}
        removePermissionRole={removePermissionRole}
      />
    </div>,
  ]);

  const addPermissionRole = () => {
    const copyOfPermissionRole = [...permissionRole];
    copyOfPermissionRole.push(
      <div key={copyOfPermissionRole.length}>
        <DataPermissionRole
          index={copyOfPermissionRole.length}
          i18nModelDataRole={props.i18nModelDataRole}
          i18nModelPermissionType={props.i18nModelPermissionType}
          i18nModelConditionExp={props.i18nModelConditionExp}
          removePermissionRole={removePermissionRole}
        />
      </div>
    );
    setPermissionRole(copyOfPermissionRole);
  };

  return (
    <div style={{ height: '500px' }}>
      <Button variant="secondary" onClick={addPermissionRole}>
        {props.i18nModelAddPermissionRole}
      </Button>
      <Form>{permissionRole}</Form>
    </div>
  );
};
