{% assign all_categories = site.portfolio | map: "category" | compact | uniq %}
{% assign all_types = site.portfolio | map: "type" | compact | uniq %}
<style>
  .matrix-content {
    display: block !important;
  }

  .matrix-content .doc-block {
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Override Chirpy's .content ul margin-bottom */
  .content .matrix-content .doc-block ul,
  .matrix-content .doc-block ul {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  .content .matrix-content .doc-block li,
  .matrix-content .doc-block li {
    margin-top: 0 !important;
    margin-bottom: 0.35rem !important;
    line-height: 1.5 !important;
  }
</style>


<div class="filter-container">
  <!-- Row 1: Auto-generated Categories -->
  <div class="filter-section filter-section-cat">
    <div class="filter-heading">Category</div>
    <div class="filter-pill-grid">
      <button class="filter-btn cat-btn active" onclick="setFilter('category', 'all', this)">
        All <span class="count"></span>
      </button>
      {% for cat in all_categories %}
        <button class="filter-btn cat-btn" onclick="setFilter('category', '{{ cat | slugify }}', this)">
          {{ cat }} <span class="count"></span>
        </button>
      {% endfor %}
    </div>
  </div>

  <!-- Row 2: Auto-generated Types -->
  <div class="filter-section">
    <div class="filter-heading">Type</div>
    <div class="filter-pill-grid">
      <button class="filter-btn type-btn active" onclick="setFilter('type', 'all', this)">
        All <span class="count"></span>
      </button>
      {% for t in all_types %}
        <button class="filter-btn type-btn" onclick="setFilter('type', '{{ t | slugify }}', this)">
          {{ t }} <span class="count"></span>
        </button>
      {% endfor %}
    </div>
  </div>
</div>

<!-- CONTENT LAYOUT -->
<div class="matrix-content">
  {% for item in site.portfolio %}
    {% capture item_cats %}{% for c in item.category %}{{ c | slugify }} {% endfor %}{% endcapture %}
    {% capture item_types %}{% for t in item.type %}{{ t | slugify }} {% endfor %}{% endcapture %}

    <div class="doc-block" data-categories="{{ item_cats | strip }}" data-types="{{ item_types | strip }}">
      {{ item.content | markdownify }}
    </div>
  {% endfor %}

  <div id="no-match" style="display: none; color: #888; font-style: italic; margin-top: 12px;">
    No matches found for this combination.
  </div>
</div>

