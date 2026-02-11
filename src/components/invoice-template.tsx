import React from 'react';

// This is a placeholder component.
// The print functionality was temporarily removed to fix a build error.
export const InvoiceTemplate = React.forwardRef<HTMLDivElement, {}>(
  (props, ref) => {
    return <div ref={ref} />;
  }
);

InvoiceTemplate.displayName = 'InvoiceTemplate';
