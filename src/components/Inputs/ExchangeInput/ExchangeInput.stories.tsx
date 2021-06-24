import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { colors } from '@static/theme'
import ExchangeInput from './ExchangeInput'

storiesOf('inputs/exchangeAmount', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <div style={{ backgroundColor: colors.gray.component, padding: '10px' }}>
      <ExchangeInput setValue={(value: string) => value} />
    </div>
  ))
