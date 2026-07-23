import { ShaderTokens } from '../contracts/ExperiencePresentationContract';
import { IShaderRegistry } from '../registries/interfaces/IShaderRegistry';
import { ShaderRegistry } from '../registries/ShaderRegistry';

export class ShaderResolver {
  constructor(private readonly shaderRegistry: IShaderRegistry = new ShaderRegistry()) {}

  resolve(primaryEmotion: string, intensity: number): ShaderTokens {
    const base = primaryEmotion === 'JOYFUL_BURST'
      ? this.shaderRegistry.getShader('CELESTIAL_SPARKS')
      : this.shaderRegistry.getShader('WARM_AURORA');

    return {
      ...base,
      intensity: Math.min(1.0, Math.max(0.1, intensity)),
      speed: Number((base.speed * (0.8 + intensity * 0.4)).toFixed(2)),
    };
  }
}
