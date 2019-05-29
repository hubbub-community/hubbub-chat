import { Server, Socket } from 'socket.io';

import { IHandlerFinder, IParse } from '../../global';

import handlerFinder from '../lib/handler-finder';

/***
 * Separates a command's command and argument
 * @function
 * @name parse
 * @param line {string} A command input from the user
 */
export const parse = (line: string): IParse => {
  // Grab a case insensitive command
  const slashWord: RegExpMatchArray = line.match(/[a-z]+\b/i) || [];
  if (slashWord && slashWord.length >= 1) {
    const cmd: string = slashWord[0];
    // Grab the arguments
    const arg: string = line.slice(cmd.length + 2, line.length);
    // Return them
    return { cmd, arg };
  }
  return { cmd: 'fallback', arg: null };
};

/***
 * Middleware to process commands from the user.
 * @function
 * @name handleCommand
 * @param line {string} The input from the client
 * @param socket {object} The socket object from the client event
 * @param io {object} The server-side Socket.io instance
 ***/

const handleCommand = async (
  line: string,
  socket: Socket,
  io: Server
): Promise<void> => {
  try {
    // Parse the line for command and argument
    const { cmd, arg } = parse(line);
    // Pick the right handler based on the command
    const handler: IHandlerFinder = await handlerFinder(cmd);
    // Call the resulting handler function with the given arguments
    handler.default(arg, socket, io);
  } catch (err) {
    console.error(err);
  }
};

export default handleCommand;
