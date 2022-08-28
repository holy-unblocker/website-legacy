// encrypting/decrypt parts of the URL
// particularly proxy,compat
import { decrypt, encrypt } from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

if (!('cryptURL key' in localStorage)) {
	localStorage['cryptURL key'] = Math.random().toString(36).slice(2);
}

const key = localStorage['cryptURL key'];

export function encryptURL(part: string) {
	return encrypt(part, key).toString();
}

export function decryptURL(part: string) {
	return decrypt(part, key).toString(Utf8);
}
