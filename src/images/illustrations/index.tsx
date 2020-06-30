import backup_01 from './backup_01.svg';
import backup_02 from './backup_02.svg';
import backup_03 from './backup_03.svg';
import backup_04 from './backup_04.svg';
import backup_05 from './backup_05.svg';
import backup_06 from './backup_06.svg';
import import_01 from './import_01.svg';
import import_02 from './import_02.svg';

// step are numbered starting from 1 so the empty element at the beginning
export const backupImages = [
    undefined,
    backup_01,
    backup_02,
    backup_03,
    backup_04,
    undefined,// recovery one
    undefined,
    backup_05,
    undefined,
    undefined,
    backup_06,
]

// for the wallet import there are 4 steps,
// but only the first and the last have an illustration,
// and since the image is selected using the step index
// we keep the step 2 and 3 empty
// step are numbered starting from 1 so the empty element at the beginning
export const importImages = [
    undefined,
    import_01,
    undefined,
    undefined,
    import_02,
]


