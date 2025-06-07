import CustomException from 'src/application/exceptions/CustomException';
import { RedisRepository } from '../../../src/infrastructure/repository/redis/RedisRepository'
import { ERROR_CARD000001 } from '../../../src/application/exceptions/ErrorConstants';

export const buildRequest = (action: string, payload: object) => {
  const evento = require('../request/middleware-lambda.json');
  evento.action = action;
  evento.payload = { ...evento.payload, ...payload };
  return evento;
};

export const mockSaveTokenRepository = (mockData) => {
  jest.spyOn(RedisRepository.prototype, 'saveToken').mockImplementation(() => Promise.resolve(mockData));
};
export const mockGetTokenDataRepository = (mockData) => {
  jest.spyOn(RedisRepository.prototype, 'getTokenData').mockImplementation(() => Promise.resolve(mockData));
};

export const httpException = (functionName) => {
  jest.spyOn(RedisRepository.prototype, functionName).mockImplementation(() => {
    throw new Error('HttpClient Exception');
  });
};
export const httpCustomException = (functionName) => {
  jest.spyOn(RedisRepository.prototype, functionName).mockImplementation(() => {
    throw new CustomException({
      ...ERROR_CARD000001
    });
  });
}