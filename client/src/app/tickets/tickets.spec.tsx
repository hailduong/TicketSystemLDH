import { render } from '@testing-library/react';

import Tickets from './index';

describe('Tickets', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Tickets tickets={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
