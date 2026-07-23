import { IShaderRegistry } from './interfaces/IShaderRegistry';
import { ShaderTokens } from '../contracts/ExperiencePresentationContract';
import { DefaultPresentationProfile } from '../fallbacks/DefaultPresentationProfile';

export class ShaderRegistry implements IShaderRegistry {
  private registry = new Map<string, ShaderTokens>();

  constructor() {
    this.registerShader('WARM_AURORA', {
      fragmentShaderKey: 'WARM_AURORA',
      speed: 0.8,
      noiseScale: 2.5,
      intensity: 0.6,
      uniforms: { u_warmth: 0.8 },
    });
    this.registerShader('CELESTIAL_SPARKS', {
      fragmentShaderKey: 'CELESTIAL_SPARKS',
      speed: 1.2,
      noiseScale: 3.0,
      intensity: 0.85,
      uniforms: { u_spark_count: 50 },
    });
  }

  getShader(key: string): ShaderTokens {
    return this.registry.get(key) || DefaultPresentationProfile.shader;
  }

  registerShader(key: string, tokens: ShaderTokens): void {
    this.registry.set(key, tokens);
  }
}
