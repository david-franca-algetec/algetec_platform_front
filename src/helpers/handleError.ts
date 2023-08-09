import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { HttpStatusCode } from './HttpStatusCode';

export const handleError = (error: FetchBaseQueryError) => {
  const { message } = error.data as { message: string };
  if (error.status === HttpStatusCode.BAD_REQUEST && message === 'Invalid credentials') {
    return 'Usuário e/ou senha inválidos!';
  }
  if (
    error.status === HttpStatusCode.BAD_REQUEST &&
    message === 'You dont have permission to change developers for this department'
  ) {
    return 'Você não tem permissão para atualizar os responsáveis para este departamento!';
  }
  if (
    error.status === HttpStatusCode.BAD_REQUEST &&
    message === 'You can only update the demands your department is responsible for'
  ) {
    return 'Você só pode atualizar as entregas pelas quais seu departamento é responsável';
  }
  if (error.status === HttpStatusCode.NOT_FOUND && message === 'Name already in use') {
    return 'Nome já em uso.';
  }
  if (error.status === HttpStatusCode.NOT_FOUND && message === 'demandTag not found') {
    return 'Tag não encontrada.';
  }
  if (
    error.status === HttpStatusCode.NOT_FOUND &&
    (message === 'AssetTags not found' || message === 'assetTag not found')
  ) {
    return 'A tag desse asset não foi encontrada.';
  }
  if (error.status === HttpStatusCode.NOT_FOUND && message === 'Developers not found') {
    return 'Desenvolvedor não encontrado.';
  }
  if (
    error.status === HttpStatusCode.NOT_FOUND &&
    (message === 'Experiments not found' || message === 'Experiment Not Found' || message === 'Experiment not found')
  ) {
    return 'Experimento não encontrado.';
  }
  if (error.status === HttpStatusCode.NOT_FOUND && message === 'Asset not found') {
    return 'Asset não encontrado.';
  }
  if (
    error.status === HttpStatusCode.NOT_FOUND &&
    (message === 'Institution Not Found' || message === 'Institution not found')
  ) {
    return 'Instituição não encontrada.';
  }
  if (error.status === HttpStatusCode.NOT_FOUND && message === 'User not found') {
    return 'Usuário não encontrado.';
  }
  if (error.status === HttpStatusCode.NOT_FOUND && message === 'DemandTags not found') {
    return 'A tag da entrega não foi encontrada.';
  }
  if (
    error.status === HttpStatusCode.BAD_REQUEST &&
    (message === 'Demand not found' || message === 'Demand not Found')
  ) {
    return 'Entrega não encontrada.';
  }
  if (error.status === HttpStatusCode.NOT_FOUND && (message === 'Demand not found' || message === 'Demand not Found')) {
    return 'Entrega não encontrada.';
  }
  if (error.status === HttpStatusCode.BAD_REQUEST && message === 'Calendar entry not found') {
    return 'Entrada do calendário não encontrada.';
  }
  if (error.status === HttpStatusCode.NOT_FOUND && message === 'Calendar entry not found') {
    return 'Entrada do calendário não encontrada.';
  }
  if (error.status === HttpStatusCode.BAD_REQUEST && message === 'Start date cannot be higher than finish date') {
    return 'A data inicial não pode ser maior que a data final.';
  }
  if (error.status === HttpStatusCode.BAD_REQUEST && message === 'Needs at least one team') {
    return 'É obrigatório ter pelo menos 1 (um) time.';
  }
  if (
    error.status === HttpStatusCode.BAD_REQUEST &&
    message === 'Scripting Start date cannot be smaller then finish date'
  ) {
    return 'A data de início da Roteirização não pode ser maior que a data final.';
  }
  if (
    error.status === HttpStatusCode.BAD_REQUEST &&
    message === 'Modeling Start date cannot be smaller then finish date'
  ) {
    return 'A data de início da Modelagem não pode ser maior que a data final.';
  }
  if (
    error.status === HttpStatusCode.BAD_REQUEST &&
    message === 'Coding Start date cannot be smaller then finish date'
  ) {
    return 'A data de início da Programação não pode ser maior que a data final.';
  }
  if (
    error.status === HttpStatusCode.BAD_REQUEST &&
    message === 'Testing Start date cannot be smaller then finish date'
  ) {
    return 'A data de início dos Testes não pode ser maior que a data final.';
  }
  if (
    error.status === HttpStatusCode.BAD_REQUEST &&
    message === 'Ualab Start date cannot be smaller then finish date'
  ) {
    return 'A data de início da Ualab não pode ser maior que a data final.';
  }
  if (
    error.status === HttpStatusCode.BAD_REQUEST &&
    message === 'You cannot add tags without being the administrator!'
  ) {
    return 'Você não tem permissão para adicionar tags.';
  }
  if (
    error.status === HttpStatusCode.BAD_REQUEST &&
    message === 'You can only update the demands you are responsible for!'
  ) {
    return 'Você só pode atualizar as entregas ao qual é responsável.';
  }
  if (
    error.status === HttpStatusCode.BAD_REQUEST &&
    message === 'You dont have permission to change developers for this department'
  ) {
    return 'Você não tem permissão para alterar os desenvolvedores desse departamento.';
  }
  if (
    error.status === HttpStatusCode.BAD_REQUEST &&
    message === 'You can only update the demands your department is responsible for'
  ) {
    return 'Você só pode atualizar as entregas ao qual seu departamento é responsável.';
  }
  if (error.status === HttpStatusCode.BAD_REQUEST && message === 'You dont have permission to change the start date') {
    return 'Você não tem permissão para alterar a data de inicio.';
  }
  if (error.status === HttpStatusCode.UNAUTHORIZED && message === 'Invalid credentials') {
    return 'Credenciais Inválidas.';
  }
  if (error.status === HttpStatusCode.BAD_REQUEST && message === 'Email already in use') {
    return 'E-mail já está em uso.';
  }
  if (
    error.status === HttpStatusCode.BAD_REQUEST &&
    message === 'You dont have permission to update this department on this demand!'
  ) {
    return 'Você não tem permissão para atualizar os responsáveis para este departamento!';
  }
  return message;
};
