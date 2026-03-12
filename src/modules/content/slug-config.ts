export type WizardStepConfig = {
  param: string
  label: string
  childrenKey?: string
  optionLabelKey: string
  entity?: 'region' | 'subRegion' | 'zone'
  modalLabel?: string
}

export type WizardConfig = {
  rootParam: string
  type: 'static-hierarchy' | 'database-list' | 'database-hierarchy'
  data?: any[]
  steps: WizardStepConfig[]
}

export const SLUG_WIZARDS: Record<string, WizardConfig> = {
  regionName: {
    rootParam: 'regionName',
    type: 'database-hierarchy',
    data: undefined,
    steps: [
      {
        param: 'regionName',
        label: 'Region',
        childrenKey: 'subRegions',
        optionLabelKey: 'name',
        entity: 'region',
      },
      {
        param: 'subRegionName',
        label: 'Subregion',
        childrenKey: 'zones',
        optionLabelKey: 'name',
        entity: 'subRegion',
      },
      {
        param: 'zonaName',
        label: 'Zone / Municipality',
        optionLabelKey: 'name',
        childrenKey: '',
        entity: 'zone',
      },
    ],
  },
  city: {
    rootParam: 'city',
    type: 'database-hierarchy',
    steps: [
      {
        param: 'city',
        label: 'City / Destination',
        optionLabelKey: 'name',
        entity: 'region',
        modalLabel: 'City / Destination',
      },
    ],
  },
}
