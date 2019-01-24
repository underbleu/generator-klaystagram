import React, { Component } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { KLAYTN_SCOPE } from 'constants/url'
import ui from 'utils/ui'
import LinkNewTab from 'components/LinkNewTab'
import IconButton from 'components/IconButton'

import './Toast.scss'

type Props = {
  toast: 'object',
}

class Toast extends Component<Props> {
  render() {
    const { toast } = this.props
    return toast && (
      <div
        className="Toast"
        key={new Date().getTime()}
      >
        <div
          className={cx('Toast__status', {
            'Toast__status--pending': toast.status === 'pending',
            'Toast__status--success': toast.status === 'success',
            'Toast__status--fail': toast.status === 'fail',
            'Toast__status--error': toast.status === 'error',
          })}
        >
          {toast.status}
        </div>
        <p className="Toast__message">{toast.message}</p>
        {
          toast.txHash &&
          <LinkNewTab
            className="Toast__txHash"
            link={`${KLAYTN_SCOPE}transaction/${toast.txHash}`}
            title={`${toast.txHash}`}
          />
        }
        <IconButton
          className="Toast__close"
          icon="icon-close.png"
          alt="close toast"
          onClick={ui.hideToast}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  toast: state.ui.toast,
})

export default connect(mapStateToProps)(Toast)