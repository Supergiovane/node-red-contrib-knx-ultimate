/*
 * This file contains information about resources that can be read/written from/to KNX devices based on their maskversion
 */

const KnxDeviceResourceInformation = {
  /** Functions to help working with the data below **/
  __getResourceInfoSetByMaskVersion: maskVersion => {
    return KnxDeviceResourceInformation.resources.filter(resource => {
      if (resource.maskVersion === maskVersion) {
        return resource.resources
      }
    })[0]
  },
  __getResourceInfoSetByMaskVersionStr: maskVersionStr => {
    return KnxDeviceResourceInformation.resources.filter(resource => {
      if (resource.ID === maskVersionStr) {
        return resource.resources
      }
    })[0]
  },
  getResourceInfoByMaskVersionAndName: (maskVersion, resourceName) => {
    let resources

    // Check whether maskVersion is a string or a number and call the fitting function to get the maskversions resources
    if (typeof maskVersion === 'number') {
      resources = KnxDeviceResourceInformation.__getResourceInfoSetByMaskVersion(maskVersion)
    } else if (typeof maskVersion === 'string') {
      resources = KnxDeviceResourceInformation.__getResourceInfoSetByMaskVersionStr(maskVersion)
    }

    // Filter out the correct resource
    if (resources) {
      return resources.resources.filter(resource => {
        if (resource.name === resourceName) {
          return resource
        }
      })[0]
    }
  },
  getResourceInfoByMaskVersionStrAndName: (maskVersionStr, resourceName) => {
  // getResourceByMaskVersionAndName already covers the maskversion strings - redirect
    return KnxDeviceResourceInformation.getResourceInfoByMaskVersionAndName(maskVersionStr, resourceName)
  },

  /** Information about device resources and how to access them - USE FUNCTIONS ABOVE INSTEAD OF DIRECT ACCESS **/
  resources: [
    {
      'ID': 'MV-0001',
      'maskVersion': 1,
      'name': 'Dummy',
      'managementModel': 'None',
      '__mediumTypeRefID': 'MT-0',
      'resources': [],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-0010',
      'maskVersion': 16,
      'name': '1.0',
      'managementModel': 'Bcu1',
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote local1',
          'addressSpace': 'Constant',
          'startAddress': 1,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 4,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 278,
          'length': 1,
          'flavour': 'AddressTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 273,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote local1',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTablePtr',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 274,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote local1',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupObjectTablePtr',
          'length': 1,
          'flavour': 'GroupObjectTable_Bcu10',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DeviceBusVoltage',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 1,
          'length': 2,
          'flavour': 'Voltage_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DevicePeiType',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 4,
          'length': 2,
          'flavour': 'PeiType_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationPeiType',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 265,
          'length': 1,
          'flavour': 'PeiType_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'IndividualAddress',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 279,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 268,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'RunError',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 269,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'RunControl_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-0011',
      'maskVersion': 17,
      'name': '1.1',
      'managementModel': 'Bcu1',
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote local1',
          'addressSpace': 'Constant',
          'startAddress': 1,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 4,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 278,
          'length': 1,
          'flavour': 'AddressTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 273,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote local1',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTablePtr',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 274,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote local1',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupObjectTablePtr',
          'length': 1,
          'flavour': 'GroupObjectTable_Bcu11',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DeviceBusVoltage',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 1,
          'length': 2,
          'flavour': 'Voltage_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DevicePeiType',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 4,
          'length': 2,
          'flavour': 'PeiType_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationPeiType',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 265,
          'length': 1,
          'flavour': 'PeiType_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'IndividualAddress',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 279,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 268,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'RunError',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 269,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'RunControl_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': [
        'MV-0010'
      ]
    },
    {
      'ID': 'MV-0012',
      'maskVersion': 18,
      'name': '1.2',
      'managementModel': 'Bcu1',
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote local1',
          'addressSpace': 'Constant',
          'startAddress': 1,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 4,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 278,
          'length': 1,
          'flavour': 'AddressTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 273,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote local1',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTablePtr',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 274,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote local1',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupObjectTablePtr',
          'length': 1,
          'flavour': 'GroupObjectTable_Bcu11',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DeviceBusVoltage',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 1,
          'length': 2,
          'flavour': 'Voltage_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DevicePeiType',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 4,
          'length': 2,
          'flavour': 'PeiType_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationPeiType',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 265,
          'length': 1,
          'flavour': 'PeiType_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'IndividualAddress',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 279,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 268,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'RunError',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 269,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'RunControl_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': [
        'MV-0010',
        'MV-0011'
      ]
    },
    {
      'ID': 'MV-0013',
      'maskVersion': 19,
      'name': '1.3',
      'managementModel': 'Bcu1',
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote local1',
          'addressSpace': 'Constant',
          'startAddress': 1,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 4,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 278,
          'length': 1,
          'flavour': 'AddressTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 273,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote local1',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTablePtr',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 274,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote local1',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupObjectTablePtr',
          'length': 1,
          'flavour': 'GroupObjectTable_Bcu11',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DeviceBusVoltage',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 1,
          'length': 2,
          'flavour': 'Voltage_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DevicePeiType',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 4,
          'length': 2,
          'flavour': 'PeiType_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationPeiType',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 265,
          'length': 1,
          'flavour': 'PeiType_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'IndividualAddress',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 279,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 268,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'RunError',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 269,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'RunControl_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': [
        'MV-0010',
        'MV-0011',
        'MV-0012',
        'MV-1012',
        'MV-1013'
      ]
    },
    {
      'ID': 'MV-0020',
      'maskVersion': 32,
      'name': '2.0',
      'managementModel': 'Bcu2',
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 277,
          'length': 1,
          'flavour': 'ManagementStyle_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 12,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 257,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationId',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 259,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTablePtr',
          'access': 'remote local1 local2',
          'addressSpace': 'Constant',
          'startAddress': 278,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 7,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote local1 local2',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAddressTablePtr',
          'length': 1,
          'flavour': 'AddressTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local1 local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 273,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote local1 local2',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTablePtr',
          'access': 'remote local1 local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 274,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 7,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote local1 local2',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupObjectTablePtr',
          'length': 1,
          'flavour': 'GroupObjectTable_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationRunControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceBusVoltage',
          'access': 'remote local2',
          'addressSpace': 'ADC',
          'startAddress': 1,
          'length': 2,
          'flavour': 'Voltage_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DevicePeiType',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 16,
          'length': 1,
          'flavour': 'PeiType_Prop',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationPeiType',
          'access': 'remote local1 local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 265,
          'length': 1,
          'flavour': 'PeiType_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'IndividualAddress',
          'access': 'local1 local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 279,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 17,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 268,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'RunError',
          'access': 'remote local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 269,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'RunError',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 269,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PollingGroupSettings',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 18,
          'length': 3,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local1 local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': [
        'MV-0010',
        'MV-0011',
        'MV-0012'
      ]
    },
    {
      'ID': 'MV-0021',
      'maskVersion': 33,
      'name': '2.1',
      'managementModel': 'Bcu2',
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 277,
          'length': 1,
          'flavour': 'ManagementStyle_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 12,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 257,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationId',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 259,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTablePtr',
          'access': 'remote local1 local2',
          'addressSpace': 'Constant',
          'startAddress': 278,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 7,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote local1 local2',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAddressTablePtr',
          'length': 1,
          'flavour': 'AddressTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local1 local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 273,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote local1 local2',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTablePtr',
          'access': 'remote local1 local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 274,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 7,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote local1 local2',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupObjectTablePtr',
          'length': 1,
          'flavour': 'GroupObjectTable_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationRunControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceBusVoltage',
          'access': 'remote local2',
          'addressSpace': 'ADC',
          'startAddress': 1,
          'length': 2,
          'flavour': 'Voltage_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DevicePeiType',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 16,
          'length': 1,
          'flavour': 'PeiType_Prop',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationPeiType',
          'access': 'remote local1 local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 265,
          'length': 1,
          'flavour': 'PeiType_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'IndividualAddress',
          'access': 'local1 local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 279,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 17,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 268,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'RunError',
          'access': 'remote local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 269,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'RunError',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 269,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'PollingGroupSettings',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 18,
          'length': 3,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local1 local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': [
        'MV-0010',
        'MV-0011',
        'MV-0012',
        'MV-0020'
      ]
    },
    {
      'ID': 'MV-0025',
      'maskVersion': 37,
      'name': '2.5',
      'managementModel': 'Bcu2',
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote local2',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 12,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 7,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote local2',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAddressTablePtr',
          'length': 1,
          'flavour': 'AddressTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote local2',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 7,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote local2',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupObjectTablePtr',
          'length': 1,
          'flavour': 'GroupObjectTable_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationRunControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceBusVoltage',
          'access': 'remote local2',
          'addressSpace': 'ADC',
          'startAddress': 1,
          'length': 2,
          'flavour': 'Voltage_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DevicePeiType',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 16,
          'length': 1,
          'flavour': 'PeiType_Prop',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationPeiType',
          'access': 'remote local2',
          'length': 1,
          'flavour': 'PeiType_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'IndividualAddress',
          'access': 'local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 279,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 17,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'RunError',
          'access': 'remote local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 269,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'PollingGroupSettings',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 18,
          'length': 3,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'HardwareType',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareConfig2',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-0300',
      'maskVersion': 768,
      'name': 'System 300',
      'managementModel': 'PropertyBased',
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementDescriptor01',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 72,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'None'
        }
      ],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-0300-01000000000000000000',
      'maskVersion': 768,
      'name': 'System 300',
      'managementModel': 'PropertyBased',
      'unloadedIndividualAddress': 767,
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 12,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 7,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 23,
          'length': 1,
          'flavour': 'AddressTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 6,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 6,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 6,
          'propertyID': 23,
          'length': 1,
          'flavour': 'AssociationTable_M112',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 7,
          'propertyID': 51,
          'length': 1,
          'flavour': 'GroupObjectTable_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 7,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 7,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationRunControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 7,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 7,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogLoadControl',
          'access': 'remote',
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'PollingGroupSettings',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 18,
          'length': 3,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 54,
          'length': 1,
          'flavour': 'ProgrammingMode_Prop',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-0300-01000001000000000000',
      'maskVersion': 768,
      'name': 'System 300',
      'managementModel': 'PropertyBased',
      'unloadedIndividualAddress': 767,
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 12,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 3,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadControl',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 1,
          'propertyID': 23,
          'length': 0,
          'flavour': 'AddressTable_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadControl',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 2,
          'propertyID': 23,
          'length': 0,
          'flavour': 'AssociationTable_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 9,
          'propertyID': 51,
          'length': 0,
          'flavour': 'GroupObjectTable_System300',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 9,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationLoadControl',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadStatus',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationRunControl',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 3,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 3,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'PollingGroupSettings',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 18,
          'length': 3,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 54,
          'length': 1,
          'flavour': 'ProgrammingMode_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-0310',
      'maskVersion': 784,
      'name': 'cEMI Server',
      'managementModel': 'None',
      '__mediumTypeRefID': 'MT-0',
      'resources': [],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-0700',
      'maskVersion': 1792,
      'name': '7.0',
      'managementModel': 'BimM112',
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46821,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogId',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46816,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTableLoadControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 12,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46826,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 16384,
          'length': 1,
          'flavour': 'AddressTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 12,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46827,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46840,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_M112',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote',
          'addressSpace': 'None',
          'length': 1,
          'flavour': 'GroupObjectTable_M112',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 12,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46828,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogLoadControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 12,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogLoadStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46829,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationRunControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 257,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 257,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogRunControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 258,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogRunStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 258,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceBusVoltage',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 1,
          'length': 2,
          'flavour': 'Voltage_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46599,
          'length': 9,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46618,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-0701',
      'maskVersion': 1793,
      'name': '7.1',
      'managementModel': 'BimM112',
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 12,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46826,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 16384,
          'length': 1,
          'flavour': 'AddressTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 12,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46827,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_M112',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote',
          'addressSpace': 'None',
          'length': 1,
          'flavour': 'GroupObjectTable_M112',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 12,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46828,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogLoadControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 12,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogLoadStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46829,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationRunControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogRunControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogRunStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceBusVoltage',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 1,
          'length': 2,
          'flavour': 'Voltage_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': [
        'MV-0700'
      ]
    },
    {
      'ID': 'MV-0705',
      'maskVersion': 1797,
      'name': '7.5',
      'managementModel': 'BimM112',
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 12,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 12,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46826,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 16384,
          'length': 1,
          'flavour': 'AddressTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableStamp',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTableLoadControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 12,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46827,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_M112',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableStamp',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote',
          'addressSpace': 'None',
          'length': 1,
          'flavour': 'GroupObjectTable_M112',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 12,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46828,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogLoadControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 12,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogLoadStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46829,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationRunControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogRunControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogRunStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationStamp',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogStamp',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceBusVoltage',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 1,
          'length': 2,
          'flavour': 'Voltage_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'HardwareType',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'FirmwareVersion',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 25,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-07B0',
      'maskVersion': 1968,
      'name': 'System B',
      'managementModel': 'SystemB',
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote local2',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote local2',
          'addressSpace': 'RelativeMemory',
          'interfaceObjectRef': 1,
          'propertyID': 7,
          'length': 2,
          'flavour': 'AddressTable_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTableStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote local2',
          'addressSpace': 'RelativeMemory',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 2,
          'flavour': 'AssociationTable_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTableStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote local2',
          'addressSpace': 'RelativeMemory',
          'interfaceObjectRef': 3,
          'propertyID': 7,
          'length': 2,
          'flavour': 'GroupObjectTable_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTableStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationRunControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationDataPtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogRunControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogRunStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogDataPtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 12,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareType',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'FirmwareVersion',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 25,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceBusVoltage',
          'access': 'remote local2',
          'addressSpace': 'ADC',
          'startAddress': 1,
          'length': 2,
          'flavour': 'Voltage_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 54,
          'length': 1,
          'flavour': 'ProgrammingMode_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 25,
          'length': 2,
          'flavour': 'HardwareConfig_Version',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareConfig2',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareConfig3',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ManagementStyle',
          'access': 'remote',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 16384,
          'length': 1,
          'flavour': 'AddressTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_M112',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote',
          'addressSpace': 'None',
          'length': 1,
          'flavour': 'GroupObjectTable_M112',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogLoadControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogLoadStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationRunControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogRunControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogRunStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceBusVoltage',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 1,
          'length': 2,
          'flavour': 'Voltage_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 54,
          'length': 1,
          'flavour': 'ProgrammingMode_Prop',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-0900',
      'maskVersion': 2304,
      'name': 'Coupler 0900',
      'managementModel': 'Bcu1',
      'unloadedIndividualAddress': 65280,
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote',
          'addressSpace': 'Constant',
          'startAddress': 1,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupFilterTable',
          'access': 'remote',
          'addressSpace': 'LcFilterMemory',
          'startAddress': 512,
          'length': 3584,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'RunError',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 269,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'LcConfig',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 283,
          'length': 1,
          'flavour': 'Lc_10',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'LcGrpConfig',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 284,
          'length': 1,
          'flavour': 'Lc_10',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'LcError',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 282,
          'length': 1,
          'flavour': 'Lc_10',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'LcMode',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 281,
          'length': 1,
          'flavour': 'Lc_10',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-0910',
      'maskVersion': 2320,
      'name': 'Coupler 0910',
      'managementModel': 'Bcu1',
      'unloadedIndividualAddress': 65280,
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote',
          'addressSpace': 'Constant',
          'startAddress': 1,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupFilterTable',
          'access': 'remote',
          'addressSpace': 'LcFilterMemory',
          'startAddress': 512,
          'length': 3584,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'RunError',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 269,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'LcConfig',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 283,
          'length': 1,
          'flavour': 'Lc_10',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'LcGrpConfig',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 284,
          'length': 1,
          'flavour': 'Lc_10',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'LcError',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 282,
          'length': 1,
          'flavour': 'Lc_10',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'LcMode',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 281,
          'length': 1,
          'flavour': 'Lc_10',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': [
        'MV-0900'
      ]
    },
    {
      'ID': 'MV-0911',
      'maskVersion': 2321,
      'name': 'Coupler 0911',
      'managementModel': 'Bcu1',
      'unloadedIndividualAddress': 65280,
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote',
          'addressSpace': 'Constant',
          'startAddress': 1,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupFilterTable',
          'access': 'remote',
          'addressSpace': 'LcFilterMemory',
          'startAddress': 512,
          'length': 3584,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'RunError',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 269,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'LcConfig',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 283,
          'length': 1,
          'flavour': 'Lc_11',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'LcGrpConfig',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 284,
          'length': 1,
          'flavour': 'Lc_11',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'LcError',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 282,
          'length': 1,
          'flavour': 'Lc_11',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'LcMode',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 281,
          'length': 1,
          'flavour': 'Lc_11',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': [
        'MV-0900',
        'MV-0910'
      ]
    },
    {
      'ID': 'MV-0912',
      'maskVersion': 2322,
      'name': 'Coupler 0912',
      'managementModel': 'Bcu1',
      'unloadedIndividualAddress': 65280,
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupFilterTable',
          'access': 'remote',
          'addressSpace': 'LcFilterMemory',
          'startAddress': 512,
          'length': 8192,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 54,
          'length': 1,
          'flavour': 'ProgrammingMode_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'MaxApduLength',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 56,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'RunError',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 53,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupFilterTableLoadControl',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupFilterTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'MainLcConfig',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 52,
          'length': 1,
          'flavour': 'Lc_12',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'SubLcConfig',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 53,
          'length': 1,
          'flavour': 'Lc_12',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'MainLcGrpConfig',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 54,
          'length': 1,
          'flavour': 'Lc_12',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'SubLcGrpConfig',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 55,
          'length': 1,
          'flavour': 'Lc_12',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'CouplServControl',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 57,
          'length': 1,
          'flavour': 'Lc_12',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'MaxRoutingApduLength',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 58,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'LcMode',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 59,
          'length': 1,
          'flavour': 'Lc_12',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ManagementStyle',
          'access': 'remote',
          'addressSpace': 'Constant',
          'startAddress': 1,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupFilterTable',
          'access': 'remote',
          'addressSpace': 'LcFilterMemory',
          'startAddress': 512,
          'length': 3584,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'RunError',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 269,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'LcConfig',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 283,
          'length': 1,
          'flavour': 'Lc_11',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'LcGrpConfig',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 284,
          'length': 1,
          'flavour': 'Lc_11',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'LcError',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 282,
          'length': 1,
          'flavour': 'Lc_11',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'LcMode',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 281,
          'length': 1,
          'flavour': 'Lc_11',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'MaxRoutingApduLength',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 58,
          'length': 2,
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': [
        'MV-0911',
        'MV-0910'
      ]
    },
    {
      'ID': 'MV-091A',
      'maskVersion': 2330,
      'name': 'Coupler 091A',
      'managementModel': 'Bcu1',
      'unloadedIndividualAddress': 65280,
      '__mediumTypeRefID': 'MT-0',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote local2',
          'addressSpace': 'Constant',
          'startAddress': 1,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupFilterTable',
          'access': 'remote local2',
          'addressSpace': 'LcFilterMemory',
          'startAddress': 512,
          'length': 3584,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'IndividualAddress',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 279,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'MaxRoutingApduLength',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 58,
          'length': 2,
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ManagementStyle',
          'access': 'remote local2',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupFilterTable',
          'access': 'remote local2',
          'addressSpace': 'LcFilterMemory',
          'startAddress': 512,
          'length': 8192,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 54,
          'length': 1,
          'flavour': 'ProgrammingMode_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'MaxApduLength',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 56,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'RunError',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 53,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupFilterTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupFilterTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'MainLcConfig',
          'access': 'remote local2',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 52,
          'length': 1,
          'flavour': 'Lc_12',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'SubLcConfig',
          'access': 'remote local2',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 53,
          'length': 1,
          'flavour': 'Lc_12',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'MainLcGrpConfig',
          'access': 'remote local2',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 54,
          'length': 1,
          'flavour': 'Lc_12',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'SubLcGrpConfig',
          'access': 'remote local2',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 55,
          'length': 1,
          'flavour': 'Lc_12',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'CouplServControl',
          'access': 'remote local2',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 57,
          'length': 1,
          'flavour': 'Lc_12',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'MaxRoutingApduLength',
          'access': 'remote local2',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 58,
          'length': 2,
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': [
        'MV-0910',
        'MV-0911',
        'MV-0912'
      ]
    },
    {
      'ID': 'MV-1011',
      'maskVersion': 4113,
      'name': '1.1',
      'managementModel': 'Bcu1',
      'maxIndividualAddress': 32767,
      'maxGroupAddress': 4095,
      '__mediumTypeRefID': 'MT-1',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote local1',
          'addressSpace': 'Constant',
          'startAddress': 1,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 4,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 278,
          'length': 1,
          'flavour': 'AddressTable_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 273,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote local1',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTablePtr',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 274,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote local1',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupObjectTablePtr',
          'length': 1,
          'flavour': 'GroupObjectTable_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DevicePeiType',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 4,
          'length': 2,
          'flavour': 'PeiType_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationPeiType',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 265,
          'length': 1,
          'flavour': 'PeiType_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ReConfig',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 257,
          'length': 1,
          'flavour': 'ReConfig_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'Sensitivity',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 257,
          'length': 1,
          'flavour': 'Sensitivity_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'FrequencyChannel',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 257,
          'length': 1,
          'flavour': 'FrequencyChannel_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'IndividualAddress',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 279,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DomainAddress',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 258,
          'length': 2,
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DomainAddress',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 258,
          'length': 2,
          'readRights': 'Configuration',
          'writeRights': 'None'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 268,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'RunError',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 269,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'RunControl_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': [
        'MV-0010',
        'MV-0011'
      ]
    },
    {
      'ID': 'MV-1012',
      'maskVersion': 4114,
      'name': '1.2',
      'managementModel': 'Bcu1',
      'maxIndividualAddress': 32767,
      'maxGroupAddress': 32767,
      '__mediumTypeRefID': 'MT-1',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote local1',
          'addressSpace': 'Constant',
          'startAddress': 1,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 4,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 278,
          'length': 1,
          'flavour': 'AddressTable_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 273,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote local1',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTablePtr',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 274,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote local1',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupObjectTablePtr',
          'length': 1,
          'flavour': 'GroupObjectTable_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DevicePeiType',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 4,
          'length': 2,
          'flavour': 'PeiType_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationPeiType',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 265,
          'length': 1,
          'flavour': 'PeiType_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ReConfig',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 257,
          'length': 1,
          'flavour': 'ReConfig_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'Sensitivity',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 257,
          'length': 1,
          'flavour': 'Sensitivity_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'FrequencyChannel',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 257,
          'length': 1,
          'flavour': 'FrequencyChannel_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'IndividualAddress',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 279,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DomainAddress',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 258,
          'length': 2,
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DomainAddress',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 258,
          'length': 2,
          'readRights': 'Configuration',
          'writeRights': 'None'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 268,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'RunError',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 269,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'RunControl_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': [
        'MV-0010',
        'MV-0011',
        'MV-0012',
        'MV-1011'
      ]
    },
    {
      'ID': 'MV-1013',
      'maskVersion': 4115,
      'name': '1.3',
      'managementModel': 'Bcu1',
      'maxIndividualAddress': 32767,
      'maxGroupAddress': 32767,
      '__mediumTypeRefID': 'MT-1',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote local1',
          'addressSpace': 'Constant',
          'startAddress': 1,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 4,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 278,
          'length': 1,
          'flavour': 'AddressTable_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 273,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote local1',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTablePtr',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 274,
          'length': 1,
          'flavour': 'Ptr_StandardMemory100',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote local1',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupObjectTablePtr',
          'length': 1,
          'flavour': 'GroupObjectTable_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DevicePeiType',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 4,
          'length': 2,
          'flavour': 'PeiType_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationPeiType',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 265,
          'length': 1,
          'flavour': 'PeiType_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ReConfig',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 257,
          'length': 1,
          'flavour': 'ReConfig_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'Sensitivity',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 257,
          'length': 1,
          'flavour': 'Sensitivity_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'FrequencyChannel',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 257,
          'length': 1,
          'flavour': 'FrequencyChannel_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'IndividualAddress',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 279,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DomainAddress',
          'access': 'local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 258,
          'length': 2,
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DomainAddress',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 258,
          'length': 2,
          'readRights': 'Configuration',
          'writeRights': 'None'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 268,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'RunError',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 269,
          'length': 1,
          'flavour': 'Runerror_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'RunControl_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local1',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': [
        'MV-0010',
        'MV-0011',
        'MV-0012',
        'MV-1011',
        'MV-1012'
      ]
    },
    {
      'ID': 'MV-1310',
      'maskVersion': 4880,
      'name': 'cEMI Server',
      'managementModel': 'None',
      '__mediumTypeRefID': 'MT-1',
      'resources': [],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-17B0',
      'maskVersion': 6064,
      'name': 'System B',
      'managementModel': 'SystemB',
      '__mediumTypeRefID': 'MT-1',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote local2',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote local2',
          'addressSpace': 'RelativeMemory',
          'interfaceObjectRef': 1,
          'propertyID': 7,
          'length': 2,
          'flavour': 'AddressTable_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAcknowledgeTable',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 53,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote local2',
          'addressSpace': 'RelativeMemory',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 2,
          'flavour': 'AssociationTable_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTableStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote local2',
          'addressSpace': 'RelativeMemory',
          'interfaceObjectRef': 3,
          'propertyID': 7,
          'length': 2,
          'flavour': 'GroupObjectTable_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTableStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationRunControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationDataPtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogRunControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogRunStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogDataPtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 12,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareType',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'FirmwareVersion',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 25,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 54,
          'length': 1,
          'flavour': 'ProgrammingMode_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DomainAddress',
          'access': 'local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 70,
          'length': 2,
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ReConfig',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 73,
          'length': 1,
          'flavour': 'ReConfig_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'FrequencyChannel',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 73,
          'length': 1,
          'flavour': 'FrequencyChannel_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 25,
          'length': 2,
          'flavour': 'HardwareConfig_Version',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareConfig2',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareConfig3',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ManagementStyle',
          'access': 'remote local2',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote local2',
          'addressSpace': 'StandardMemory',
          'startAddress': 16384,
          'length': 1,
          'flavour': 'AddressTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote local2',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_M112',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote local2',
          'addressSpace': 'None',
          'length': 1,
          'flavour': 'GroupObjectTable_M112',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationRunControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogRunControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogRunStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceBusVoltage',
          'access': 'remote local2',
          'addressSpace': 'ADC',
          'startAddress': 1,
          'length': 2,
          'flavour': 'Voltage_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 54,
          'length': 1,
          'flavour': 'ProgrammingMode_Prop',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-1900',
      'maskVersion': 6400,
      'name': '7.1 PL',
      'managementModel': 'BimM112',
      'unloadedIndividualAddress': 32512,
      'maxIndividualAddress': 32767,
      '__mediumTypeRefID': 'MT-0',
      '__otherMediumTypeRefID': 'MT-1',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote',
          'addressSpace': 'Constant',
          'startAddress': 1,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 20497,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 20497,
          'length': 4,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupFilterTable',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 16387,
          'length': 4096,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DeviceBusVoltage',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 1,
          'length': 2,
          'flavour': 'Voltage_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ReConfig',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 20494,
          'length': 1,
          'flavour': 'ReConfig_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'FrequencyChannel',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 20494,
          'length': 1,
          'flavour': 'FrequencyChannel_Bcu1PL',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DomainAddress',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 20496,
          'length': 1,
          'readRights': 'Configuration',
          'writeRights': 'None'
        },
        {
          'name': 'MainLcGrpConfig',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 20749,
          'length': 1,
          'flavour': 'PlMc',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'SubLcGrpConfig',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 20750,
          'length': 1,
          'flavour': 'PlMc',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-2705',
      'maskVersion': 9989,
      'name': 'RF 7.5',
      'managementModel': 'BimM112',
      '__mediumTypeRefID': 'MT-2',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 12,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 16384,
          'length': 1,
          'flavour': 'AddressTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableStamp',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTableLoadControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_M112',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableStamp',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote',
          'addressSpace': 'None',
          'length': 1,
          'flavour': 'GroupObjectTable_M112',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogLoadControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogLoadStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationRunControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogRunControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogRunStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationStamp',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogStamp',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DomainAddress',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 82,
          'length': 6,
          'readRights': 'Configuration',
          'writeRights': 'None'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 54,
          'length': 1,
          'flavour': 'ProgrammingMode_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ReConfig',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 19,
          'propertyID': 57,
          'length': 1,
          'flavour': 'ReConfig_Rf',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'RfDeviceMode',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 19,
          'propertyID': 51,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'HardwareType',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'FirmwareVersion',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 25,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-27B0',
      'maskVersion': 10160,
      'name': 'RF System B',
      'managementModel': 'SystemB',
      '__mediumTypeRefID': 'MT-2',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote local2',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote local2',
          'addressSpace': 'RelativeMemory',
          'interfaceObjectRef': 1,
          'propertyID': 7,
          'length': 2,
          'flavour': 'AddressTable_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTableStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote local2',
          'addressSpace': 'RelativeMemory',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 2,
          'flavour': 'AssociationTable_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTableStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote local2',
          'addressSpace': 'RelativeMemory',
          'interfaceObjectRef': 3,
          'propertyID': 7,
          'length': 2,
          'flavour': 'GroupObjectTable_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTableStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationRunControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationDataPtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogRunControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogRunStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogDataPtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 12,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DomainAddress',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 82,
          'length': 6,
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ReConfig',
          'access': 'remote local2',
          'addressSpace': 'Property',
          'interfaceObjectRef': 19,
          'propertyID': 57,
          'length': 1,
          'flavour': 'ReConfig_Rf',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'RfDeviceMode',
          'access': 'remote local2',
          'addressSpace': 'Property',
          'interfaceObjectRef': 19,
          'propertyID': 51,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'HardwareType',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'FirmwareVersion',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 25,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 54,
          'length': 1,
          'flavour': 'ProgrammingMode_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 25,
          'length': 2,
          'flavour': 'HardwareConfig_Version',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareConfig2',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareConfig3',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        }
      ],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-2920',
      'maskVersion': 10528,
      'name': 'Coupler 2920',
      'managementModel': 'SystemB',
      'unloadedIndividualAddress': 65280,
      '__mediumTypeRefID': 'MT-0',
      '__otherMediumTypeRefID': 'MT-2',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupFilterTable',
          'access': 'remote',
          'addressSpace': 'RelativeMemoryByObjectType',
          'interfaceObjectRef': 6,
          'propertyID': 7,
          'occurrence': 1,
          'length': 8192,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 54,
          'length': 1,
          'flavour': 'ProgrammingMode_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'MaxApduLength',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 56,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupFilterTableLoadControl',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 5,
          'occurrence': 1,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupFilterTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 5,
          'occurrence': 1,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupFilterTablePtr',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 7,
          'occurrence': 1,
          'length': 1,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupFilterTableUse',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 67,
          'occurrence': 1,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'CouplServControl',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 57,
          'occurrence': 1,
          'length': 1,
          'flavour': 'Lc_12',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'MaxRoutingApduLength',
          'access': 'remote',
          'addressSpace': 'Property',
          'interfaceObjectRef': 6,
          'propertyID': 58,
          'occurrence': 1,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 12,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareType',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        }
      ],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-5705',
      'maskVersion': 22277,
      'name': '7.5 IP',
      'managementModel': 'BimM112',
      '__mediumTypeRefID': 'MT-5',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 12,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 12,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46826,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 16384,
          'length': 1,
          'flavour': 'AddressTable_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableStamp',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTableLoadControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 12,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46827,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 2,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote',
          'addressSpace': 'Pointer',
          'ptrResource': 'GroupAssociationTablePtr',
          'length': 1,
          'flavour': 'AssociationTable_M112',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableStamp',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote',
          'addressSpace': 'None',
          'length': 1,
          'flavour': 'GroupObjectTable_M112',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 12,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46828,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogLoadControl',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 260,
          'length': 12,
          'flavour': 'LoadControl_M112',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogLoadStatus',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 46829,
          'length': 1,
          'flavour': 'LoadControl_M112',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationRunControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogRunControl',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogRunStatus',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationStamp',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogStamp',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceBusVoltage',
          'access': 'remote',
          'addressSpace': 'ADC',
          'startAddress': 1,
          'length': 2,
          'flavour': 'Voltage_Adc',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote',
          'addressSpace': 'StandardMemory',
          'startAddress': 96,
          'length': 1,
          'flavour': 'ProgrammingMode_Bcu1',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'HardwareType',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'FirmwareVersion',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 25,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Configuration',
          'writeRights': 'Configuration'
        }
      ],
      'compatibleMaskVersionIDs': []
    },
    {
      'ID': 'MV-57B0',
      'maskVersion': 22448,
      'name': 'System B IP',
      'managementModel': 'SystemB',
      '__mediumTypeRefID': 'MT-5',
      'resources': [
        {
          'name': 'ManagementStyle',
          'access': 'remote local2',
          'addressSpace': 'Constant',
          'startAddress': 2,
          'length': 1,
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTable',
          'access': 'remote local2',
          'addressSpace': 'RelativeMemory',
          'interfaceObjectRef': 1,
          'propertyID': 7,
          'length': 2,
          'flavour': 'AddressTable_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAddressTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAddressTableStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 1,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTable',
          'access': 'remote local2',
          'addressSpace': 'RelativeMemory',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 2,
          'flavour': 'AssociationTable_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupAssociationTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupAssociationTableStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 2,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTableLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTableLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTable',
          'access': 'remote local2',
          'addressSpace': 'RelativeMemory',
          'interfaceObjectRef': 3,
          'propertyID': 7,
          'length': 2,
          'flavour': 'GroupObjectTable_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'GroupObjectTablePtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'GroupObjectTableStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 3,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationRunControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationRunStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'ApplicationDataPtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'ApplicationStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 4,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 13,
          'length': 5,
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogLoadControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 5,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogLoadStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 5,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogRunControl',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 6,
          'length': 10,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'None',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogRunStatus',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 6,
          'length': 1,
          'flavour': 'LoadControl_Bcu2',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'PeiprogDataPtr',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 7,
          'length': 4,
          'flavour': 'Ptr_StandardMemory',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'PeiprogStamp',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'interfaceObjectRef': 5,
          'propertyID': 27,
          'length': 8,
          'flavour': 'Stamp_SystemB',
          'readRights': 'Runtime',
          'writeRights': 'None'
        },
        {
          'name': 'DeviceManufacturerId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 12,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceOrderId',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'DeviceSerialNumber',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 11,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareType',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'FirmwareVersion',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 25,
          'length': 2,
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'ProgrammingMode',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 54,
          'length': 1,
          'flavour': 'ProgrammingMode_Prop',
          'readRights': 'Runtime',
          'writeRights': 'Configuration'
        },
        {
          'name': 'HardwareConfig1',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 25,
          'length': 2,
          'flavour': 'HardwareConfig_Version',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareConfig2',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 78,
          'length': 6,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        },
        {
          'name': 'HardwareConfig3',
          'access': 'remote local2',
          'addressSpace': 'SystemProperty',
          'propertyID': 15,
          'length': 10,
          'flavour': 'HardwareConfig_Identical',
          'readRights': 'Runtime',
          'writeRights': 'Manufacturer'
        }
      ],
      'compatibleMaskVersionIDs': []
    }
  ]
}

module.exports = KnxDeviceResourceInformation
