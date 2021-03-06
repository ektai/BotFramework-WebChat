import {
  Composer as FilmComposer,
  createBasicStyleSet as createBasicStyleSetForReactFilm,
  Flipper,
  useScrollBarWidth,
  useScrolling,
  useStyleSetClassNames as useReactFilmStyleSetClassNames
} from 'react-film';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import CarouselFilmStrip from './CarouselFilmStrip';
import useDirection from '../hooks/useDirection';
import useLocalizer from '../hooks/useLocalizer';
import useNonce from '../hooks/internal/useNonce';
import useStyleSet from '../hooks/useStyleSet';
import useStyleToEmotionObject from '../hooks/internal/useStyleToEmotionObject';

const ROOT_STYLE = {
  '&.webchat__carousel-layout': {
    overflow: 'hidden',
    position: 'relative'
  }
};

const CarouselLayoutCore = ({
  activity,
  hideTimestamp,
  renderActivityStatus,
  renderAttachment,
  renderAvatar,
  showCallout
}) => {
  const [{ carouselFlipper: carouselFlipperStyleSet }] = useStyleSet();
  const [{ root: filmRootClassName }] = useReactFilmStyleSetClassNames();
  const [direction] = useDirection();
  const [scrollBarWidth] = useScrollBarWidth();
  const [scrolling] = useScrolling();
  const leftSideFlipper = direction === 'rtl' ? '>' : '<';
  const localize = useLocalizer();
  const rightSideFlipper = direction === 'rtl' ? '<' : '>';
  const rootClassName = useStyleToEmotionObject()(ROOT_STYLE) + '';

  return (
    <div
      className={classNames('webchat__carousel-layout', rootClassName, carouselFlipperStyleSet + '', filmRootClassName)}
    >
      <div className={classNames('react-film__main', { 'react-film__main--scrolling': scrolling })}>
        <CarouselFilmStrip
          activity={activity}
          hideTimestamp={hideTimestamp}
          renderActivityStatus={renderActivityStatus}
          renderAttachment={renderAttachment}
          renderAvatar={renderAvatar}
          showCallout={showCallout}
        />
        {scrollBarWidth !== '100%' && (
          <React.Fragment>
            <Flipper aria-label={localize('CAROUSEL_FLIPPER_LEFT_ALT')} blurFocusOnClick={true} mode="left">
              {leftSideFlipper}
            </Flipper>
            <Flipper aria-label={localize('CAROUSEL_FLIPPER_RIGHT_ALT')} blurFocusOnClick={true} mode="right">
              {rightSideFlipper}
            </Flipper>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

CarouselLayoutCore.defaultProps = {
  hideTimestamp: false,
  renderActivityStatus: false,
  renderAvatar: false,
  showCallout: true
};

CarouselLayoutCore.propTypes = {
  activity: PropTypes.shape({
    attachments: PropTypes.array
  }).isRequired,
  hideTimestamp: PropTypes.bool,
  renderActivityStatus: PropTypes.oneOfType([PropTypes.oneOf([false]), PropTypes.func]),
  renderAttachment: PropTypes.func.isRequired,
  renderAvatar: PropTypes.oneOfType([PropTypes.oneOf([false]), PropTypes.func]),
  showCallout: PropTypes.bool
};

const CarouselLayout = props => {
  const { activity: { attachments = [] } = {} } = props;
  const [direction] = useDirection();
  const [nonce] = useNonce();
  const filmStyleSet = useMemo(() => createBasicStyleSetForReactFilm({ cursor: null }), []);

  return (
    <FilmComposer dir={direction} nonce={nonce} numItems={attachments.length} styleSet={filmStyleSet}>
      <CarouselLayoutCore {...props} />
    </FilmComposer>
  );
};

CarouselLayout.defaultProps = {
  ...CarouselLayoutCore.defaultProps
};

CarouselLayout.propTypes = {
  ...CarouselLayoutCore.propTypes
};

export default CarouselLayout;
