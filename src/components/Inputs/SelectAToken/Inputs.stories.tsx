import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { colors } from '@static/theme'
import AmountInputExchange from './AmountInputExchange'

storiesOf('inputs/amountExchange', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <div style={{ backgroundColor: colors.gray.dark, padding: '10px' }}>
      <AmountInputExchange value={22} setValue={(value: string) => value} currency={'xUSD'} />
    </div>
  ))
