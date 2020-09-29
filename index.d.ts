declare module 'varint' {
    import { Buffer } from 'buffer';

    export function encode (number: number, buffer?: Buffer, offset?: number): Buffer;
    export function decode (buffer: Buffer, offset?: number): Buffer;
    export function encodingLength (number: number): number;
}
