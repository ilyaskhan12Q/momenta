import { GestureTokens } from '../contracts/ExperiencePresentationContract';
import { IGestureRegistry } from '../registries/interfaces/IGestureRegistry';
import { GestureRegistry } from '../registries/GestureRegistry';

export class GestureResolver {
  constructor(private readonly gestureRegistry: IGestureRegistry = new GestureRegistry()) {}

  resolve(gestureType?: string): GestureTokens {
    const key = gestureType || 'WAX_SEAL';
    return this.gestureRegistry.getGesture(key);
  }
}
