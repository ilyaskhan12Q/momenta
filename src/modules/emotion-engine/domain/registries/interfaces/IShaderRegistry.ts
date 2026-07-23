import { ShaderTokens } from '../../contracts/ExperiencePresentationContract';

export interface IShaderRegistry {
  getShader(key: string): ShaderTokens;
  registerShader(key: string, tokens: ShaderTokens): void;
}
