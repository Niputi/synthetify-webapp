import React from 'react'
import { storiesOf } from '@storybook/react'
import CommonButton from './CommonButton'
import { action } from '@storybook/addon-actions'
import { withKnobs } from '@storybook/addon-knobs'
import MaxButton from './MaxButton'
storiesOf('buttons/CommonButton', module)
  .addDecorator(withKnobs)
  .add('default', () => <CommonButton name='Read litepaper' onClick={action('clicked')} />)
  .add('maxButton', () => <div style={{ backgroundColor: '#1E1B23', padding: '10px' }}>
    <MaxButton onClick={action('clicked')} />
  </div>)
