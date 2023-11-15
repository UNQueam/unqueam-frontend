import animalAvatar from '../assets/avatars/animal-avatar.png'
import astronautSkullAvatar from '../assets/avatars/astronaut-skull.png'
import boldLionAvatar from '../assets/avatars/bold-lion.png'
import cartoonKoalaAvatar from '../assets/avatars/cartoon-koala.png'
import chickAvatar from '../assets/avatars/chick.png'
import cuteCatAvatar from '../assets/avatars/cute-cat.png'
import cuteDevilMonsterAvatar from '../assets/avatars/cute-devil-monster.png'
import dragonHeadAvatar from '../assets/avatars/dragon-head.png'
import monkeyGlassesAvatar from '../assets/avatars/monkey-glasses.png'
import monsterWarriorAvatar from '../assets/avatars/monster-warrior.png'
import owlReadingAvatar from '../assets/avatars/owl-reading.png'
import skullWarriorAvatar from '../assets/avatars/skull-warrior.png'
import tribalWarriorAvatar from '../assets/avatars/tribal-warrior.png'
import wolfHeadAvatar from '../assets/avatars/wolf-head.png'
import womenAvatarGame from '../assets/avatars/women-avatar-game.png'
import zeusAvatar from '../assets/avatars/zeus.png'

const avatars = {
    'womenGamer': womenAvatarGame,
    'wolfHead': wolfHeadAvatar,
    'tribalWarrior': tribalWarriorAvatar,
    'skullWarrior': skullWarriorAvatar,
    'owlReading': owlReadingAvatar,
    'monsterWarrior': monsterWarriorAvatar,
    'monkeyGlasses': monkeyGlassesAvatar,
    'dragonHead': dragonHeadAvatar,
    'cuteDevilMonster': cuteDevilMonsterAvatar,
    'cuteCat': cuteCatAvatar,
    'chick': chickAvatar,
    'cartoonKoala': cartoonKoalaAvatar,
    'boldLion': boldLionAvatar,
    'astronautSkull': astronautSkullAvatar,
    'animal': animalAvatar,
    'zeus': zeusAvatar
}

export const getAvatarImage = (avatarId) => {
    return avatars[avatarId]
}