import rank_bronze from '../assets/icons/ranks/rank_bronze.png'
import rank_silver from '../assets/icons/ranks/rank_silver.png'
import rank_gold from '../assets/icons/ranks/rank_gold.png'

const rankIcons = {
    "unranked": null,
    "bronze": rank_bronze,
    "silver": rank_silver,
    "gold": rank_gold
};

const defaultRank = rankIcons["unranked"]

// TODO: Debe retornar .png de los iconos o retornamos iconos directamente?
class RankIconsFactory {

    static getRankIcon(aRank) {
        let rankName = aRank.toLowerCase()
        return rankIcons[rankName] ? rankIcons[rankName] : defaultRank
    }
}

export default RankIconsFactory

