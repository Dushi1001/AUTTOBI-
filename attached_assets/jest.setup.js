// Temporary mocks for test stabilization
jest.mock('src/components/portfolio/PortfolioAnalytics', () => ({
  PortfolioAnalytics: function() {
    return {
      $$typeof: Symbol.for('react.element'),
      type: 'div',
      props: { children: 'Portfolio Analytics Mock' },
      ref: null
    };
  }
}));

jest.mock('src/components/trading/TradingContainer', () => ({
  TradingContainer: function() {
    return {
      $$typeof: Symbol.for('react.element'),
      type: 'div',
      props: { children: 'Trading Container Mock' },
      ref: null
    };
  }
}));

jest.mock('src/components/trading/AdvancedOrderEntry', () => ({
  AdvancedOrderEntry: function() {
    return {
      $$typeof: Symbol.for('react.element'),
      type: 'div',
      props: { children: 'Advanced Order Entry Mock' },
      ref: null
    };
  }
}));