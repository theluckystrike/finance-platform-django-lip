import React, { forwardRef, memo, ReactNode, CSSProperties } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as SvgIcon from './svg-icons';
import * as Material from './material-icons';

interface IRefWrapperProps extends Record<string, any> {
  children: ReactNode;
}

const RefWrapper = forwardRef<HTMLSpanElement, IRefWrapperProps>(
  ({ children }, ref) => {
    if (ref) {
      return (
        <span ref={ref} data-only-ref="true">
          {children}
        </span>
      );
    }
    return <>{children}</>;
  }
);
RefWrapper.displayName = 'RefWrapper';

const Icon = forwardRef<HTMLSpanElement, any>(
  ({ icon, className, color, size, forceFamily, style, ...props }, ref) => {
    const IconName = icon;

    // @ts-ignore
    const SvgIconWrapper = SvgIcon[IconName];
    // @ts-ignore
    const MaterialWrapper = Material[IconName];

    // Create custom styles for size if provided
    const customStyle: CSSProperties = {
      ...style,
      fontSize: size ? size : undefined,
      width: size ? size : undefined,
      height: size ? size : undefined,
    };

    const ClassName = classNames(
      'svg-icon',
      { [`text-${color}`]: color },
      className,
    );

    const isForceCustom = forceFamily === 'custom';
    const isForceMaterial = forceFamily === 'material';

    if (
      isForceCustom ||
      (!isForceMaterial && typeof SvgIconWrapper === 'function')
    ) {
      return (
        <RefWrapper ref={ref}>
          <SvgIconWrapper
            data-name={`SvgIcon--${IconName}`}
            className={classNames('svg-icon--custom', ClassName)}
            style={customStyle}
            {...props}
          />
        </RefWrapper>
      );
    }
    if (
      isForceMaterial ||
      (!isForceCustom && typeof MaterialWrapper === 'function')
    ) {
      return (
        <RefWrapper ref={ref}>
          <MaterialWrapper
            data-name={`Material--${icon}`}
            className={classNames('svg-icon--material', ClassName)}
            style={customStyle}
            {...props}
          />
        </RefWrapper>
      );
    }
    return null;
  },
);

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    null,
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'light',
    'dark',
  ]),
  size: PropTypes.string, // Adjusted to handle any valid CSS size value
  forceFamily: PropTypes.oneOf([null, 'custom', 'material']),
  style: PropTypes.object, // Add style prop for further customization
};

Icon.defaultProps = {
  className: undefined,
  color: undefined,
  size: null,
  forceFamily: null,
  style: {}, // Default style prop
};

Icon.displayName = 'Icon';

export default memo(Icon);
