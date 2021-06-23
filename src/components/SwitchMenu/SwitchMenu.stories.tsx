// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import SwitchMenu, { IMenuItem } from '@components/SwitchMenu/SwitchMenu'
import { action } from '@storybook/addon-actions'
import ActionMenu, { IActionContents } from '@components/SwitchMenu/ActionMenu'
import { colors } from '@static/theme'

const exampleItems: IMenuItem = {
  option1: 'Content1',
  option2: 'Content2',
  option3: 'Content3',
  option4: 'Content4',
  option5: 'Content5'
}

const actionContents: IActionContents = {
  burn: 'burn',
  deposit: 'deposit',
  mint: 'mint',
  rewards: 'rewards',
  withdraw: 'withdraw'
}

storiesOf('menu/switchMenu', module)
  .addDecorator(withKnobs)
  .add('Max width', () => (
    <div style={{ backgroundColor: colors.gray.component, padding: '10px' }}>
      <SwitchMenu menuItems={exampleItems} onChange={action('switch menu')} />
    </div>
  ))
  .add('Actions', () => (
    <div style={{ backgroundColor: colors.gray.component, padding: '10px' }}>
      <ActionMenu actionContents={actionContents} onChange={action('change action')} />
    </div>
  ))
