import { MouseEventHandler, ReactElement } from 'react';

import { Button } from '@mui/material';

type PropTypes = {
  disabled: boolean;
  children: ReactElement | string;
  handler: MouseEventHandler<HTMLButtonElement>;
};

const SubmitButton = ({
  disabled,
  children,
  handler,
}: PropTypes): ReactElement => (
  <Button
    variant="contained"
    size="large"
    onClick={handler}
    disabled={disabled}
  >
    {children}
  </Button>
);

export default SubmitButton;
