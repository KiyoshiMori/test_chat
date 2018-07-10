import React, { createContext } from 'react';

export const ButtonsContext = createContext({
	buttonFunction: () => console.log('pressed'),
});