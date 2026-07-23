import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import ExperiencePage from '../../src/app/experience/[token]/page';

describe('Recipient Experience Page Route (/experience/[token])', () => {
  it('should instantiate ExperiencePage component with token route param', () => {
    const element = React.createElement(ExperiencePage, { params: Promise.resolve({ token: 'testtoken1234567' }) });
    expect(element).toBeDefined();
    expect(element.type).toBe(ExperiencePage);
  });
});
