import React, { useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export const successNotify = (message: string) => toast.success(message);
export const errorNotify = (message: string) => toast(message, { icon: '😝' });

export function useAsyncToast() {
  const asyncToast = useCallback(
    (resultPromise: any, data: any, messages: any) => {
      toast
        .promise(
          resultPromise,
          {
            loading: messages.loading,
            success: messages.success(data),
            error: (err) => messages.error(err),
          },
          {
            style: {
              marginLeft: '300px',
              minWidth: '250px',
            },
          }
        )
        .catch((err) => {
          console.error(err);
        });
    },
    []
  );

  return { asyncToast };
}

export function ToastContainer() {
  return <Toaster position="bottom-center" reverseOrder={true} />;
}
