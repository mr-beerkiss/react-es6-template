'use strict';

import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import App from '../App.jsx';

describe('App', () => {
    it('renders', () => {
        const app = TestUtils.renderIntoDocument(<App />);
        expect(app).toBeTruthy();
    });
});

