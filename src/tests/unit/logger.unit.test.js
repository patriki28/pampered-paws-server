import logger from '../../lib/winston/logger';

describe('[Unit] - logger', () => {
  it('should log info log', () => {
    const logSpy = jest.spyOn(logger, 'log');
    const infoLog = {
      level: 'info',
      message: '[2024-12-05 14:51:42 info]: Test info log message',
    };

    logger.log(infoLog);

    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        [Symbol.for('message')]: expect.stringContaining(
          `[2024-12-05 14:51:42 info]: Test info log message`,
        ),
        [Symbol.for('level')]: 'info',
      }),
    );
  });

  it('should log error log', () => {
    const logSpy = jest.spyOn(logger, 'log');

    const errorLog = {
      level: 'error',
      message: `[2024-12-05 14:51:42 error]: Test error log message`,
    };

    logger.log(errorLog);

    expect(logSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        [Symbol.for('message')]: expect.stringContaining(
          `[2024-12-05 14:51:42 error]: Test error log message`,
        ),
        [Symbol.for('level')]: 'error',
      }),
    );
  });
});
