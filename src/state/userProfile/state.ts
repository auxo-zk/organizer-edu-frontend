import { addressWallet, getProfile, UserProfile } from '@auxo-dev/frontend-common';
import { Atom, atom, useAtom, useSetAtom } from 'jotai';
import { atomWithRefresh, loadable } from 'jotai/utils';

const addressTest = 'B62qmRKcdXqHe1SxukHQtWUHyMX3NMGCkvHnHao3VsdoBMNRDkQq6na';
const userProfile = atomWithRefresh<Promise<UserProfile>>(async (get) => {
    const _addressWallet = get(addressWallet);

    try {
        if (!_addressWallet) {
            throw new Error('Address wallet is not found');
        }
        console.log('Get profile', _addressWallet);
        const profile = await getProfile('organizer', _addressWallet);
        return profile;
    } catch (error) {
        console.log('Get profile error', error);
        return {
            address: '',
            name: '',
            role: '',
            link: '',
            description: '',
            img: '',
        } as UserProfile;
    }
});
export const useFetchUserProfile = () => useSetAtom(userProfile);

export const useUserProfile = () => useAtom(loadable(userProfile));
