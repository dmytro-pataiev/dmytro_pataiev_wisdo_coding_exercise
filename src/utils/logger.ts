export const logger = {
  info: (message: string, data?: any) => {
    console.log(JSON.stringify({ level: 'info', message, data }));
  },
  error: (message: string, data?: any) => {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        data:
          data instanceof Error
            ? { message: data.message, stack: data.stack }
            : data,
      }),
    );
  },
};
