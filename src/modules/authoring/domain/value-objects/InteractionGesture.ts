import { ValueObject } from '../../../../shared/domain/ValueObject';

export type GestureType = 'WAX_SEAL' | 'CANDLE_BLOW' | 'RIBBON_PULL' | 'LETTER_FLIP';

export class InteractionGesture extends ValueObject<{ value: GestureType }> {
  private constructor(value: GestureType) {
    super({ value });
  }

  public get value(): GestureType {
    return this.props.value;
  }

  public static create(type: GestureType = 'WAX_SEAL'): InteractionGesture {
    return new InteractionGesture(type);
  }
}
