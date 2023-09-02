import ranks from '../assets/icons/ranks'

const rankIcons = {
    "rank1": ranks.rank1,
    "rank2": ranks.rank2,
    "rank3": ranks.rank3,
    "rank4": ranks.rank4,
    "rank5": ranks.rank5
};

const defaultRank = ranks.rank5

// TODO: Debe retornar .png de los iconos o retornamos iconos directamente?
class RankIconsFactory {

    static getRankIcon(aRank) {
        let rankName = aRank.toLowerCase()
        return rankIcons[rankName] ? rankIcons[rankName] : defaultRank
    }
}

