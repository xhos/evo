import { logLevel, log } from '../../utils/log';

import areCommandsDifferent from '../../utils/areCommandsDifferent';
import getApplicationCommands from '../../utils/getApplicationCommands';
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client: any) => {
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(client, process.env.TEST_GUILD || '');

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = await applicationCommands.cache.find((cmd: any) => cmd.name === name);

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          log(`🗑 Deleted command "${name}".`);
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });

          log(`🔁 Edited command "${name}".`);
        }
      } else {
        if (localCommand.deleted) {
          log(`⏩ Skipping registering command "${name}" as it's set to delete.`);
          continue;
        }

        await applicationCommands.create({
          name,
          description,
          options,
        });

        log(`👍 Registered command "${name}."`);
      }
    }
  } catch (error: any) {
    log(`There was an error: ${error}\n${error.stack}`, logLevel.Error);
  }
};

export {};
