package me.cire3.finnovate.proicio.util

object CategoryMapper {
    val businessCategories = listOf(
        "Outdoor & Recreation",
        "Food & Dining",
        "Home & Garden",
        "Local News",
        "Technology",
    )

    private val related = mapOf(
        "Outdoor & Recreation" to listOf("Outdoor & Recreation", "Product Reviews", "Sporting Goods"),
        "Food & Dining" to listOf("Food & Dining", "Local News", "Community Events"),
        "Home & Garden" to listOf("Home & Garden", "DIY", "Local Services"),
        "Local News" to listOf("Local News", "Community Events", "Local Services"),
        "Technology" to listOf("Technology", "Product Reviews", "Business & Productivity"),
    )

    fun relatedCategories(category: String): List<String> = related[category] ?: listOf("General Audience")
}
