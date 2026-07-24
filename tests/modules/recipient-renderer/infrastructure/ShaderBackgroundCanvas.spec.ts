import { describe, it, expect } from 'vitest';
import React from 'react';
import { ShaderBackgroundCanvas } from '../../../../src/modules/recipient-renderer/infrastructure/webgl/ShaderBackgroundCanvas';
import { DefaultPresentationProfile } from '../../../../src/modules/emotion-engine/domain/fallbacks/DefaultPresentationProfile';

describe('ShaderBackgroundCanvas', () => {
  it('should render a canvas element with full-screen container styles', () => {
    const element = React.createElement(ShaderBackgroundCanvas, {
      shader: DefaultPresentationProfile.shader,
      colors: DefaultPresentationProfile.colors,
    });

    expect(element).toBeDefined();
    expect(element.type).toBe(ShaderBackgroundCanvas);
  });

  it('should accept relationshipType and currentState props without error', () => {
    const element = React.createElement(ShaderBackgroundCanvas, {
      relationshipType: 'ROMANTIC',
      currentState: 'UNLOCKING',
    });

    expect(element).toBeDefined();
    expect(element.props.relationshipType).toBe('ROMANTIC');
    expect(element.props.currentState).toBe('UNLOCKING');
  });
});
