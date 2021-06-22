import React from 'react'
import { storiesOf } from '@storybook/react'
import AmountInput from './AmountInput'

import { withKnobs } from '@storybook/addon-knobs'
import { colors } from '@static/theme'

storiesOf('inputs/amountExchange', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <div style={{ backgroundColor: colors.gray.dark, padding: '10px' }}>
      <AmountInput setValue={(value: string) => value} currency={'xUSD'} />
    </div>
  ))
