let currentFilters = {
  categories: ['all'], 
  type: 'all'
};

// Main entry point on page load
document.addEventListener("DOMContentLoaded", function() {
  readUrlParams();
  applyFilters();
});

function readUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // 1. Parse 'category' parameter (handles comma-separated lists for multi-select)
  const catParam = urlParams.get('category');
  if (catParam && catParam !== 'all') {
    const requestedCats = catParam.split(',').map(c => c.trim().toLowerCase());
    
    // Clear out 'all' default state if valid entries exist
    if (requestedCats.length > 0) {
      currentFilters.categories = [];
      const allCatBtn = document.querySelector('.cat-btn[onclick*="\'all\'"]');
      if (allCatBtn) allCatBtn.classList.remove('active');
    }
    
    requestedCats.forEach(catSlug => {
      // Find the button that matches this specific slug
      const btn = document.querySelector(`.cat-btn[onclick*="'${catSlug}'"]`);
      if (btn) {
        currentFilters.categories.push(catSlug);
        btn.classList.add('active');
      }
    });
    
    // Fallback safety: If bad slugs were passed, revert row back to 'all'
    if (currentFilters.categories.length === 0) {
      currentFilters.categories = ['all'];
      const allCatBtn = document.querySelector('.cat-btn[onclick*="\'all\'"]');
      if (allCatBtn) allCatBtn.classList.add('active');
    }
  }

  // 2. Parse 'type' parameter (handles single-select entry)
  const typeParam = urlParams.get('type');
  if (typeParam && typeParam !== 'all') {
    const targetTypeSlug = typeParam.trim().toLowerCase();
    const btn = document.querySelector(`.type-btn[onclick*="'${targetTypeSlug}'"]`);
    
    if (btn) {
      // Deactivate default 'all' type button
      const allTypeBtn = document.querySelector('.type-btn[onclick*="\'all\'"]');
      if (allTypeBtn) allTypeBtn.classList.remove('active');
      
      currentFilters.type = targetTypeSlug;
      btn.classList.add('active');
    }
  }
}

// User-Facing Click Controller
function setFilter(axis, value, buttonEl) {
  if (axis === 'category') {
    if (value === 'all') {
      // If clicking "All", clear everything else and activate only "All"
      currentFilters.categories = ['all'];
      document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
      buttonEl.classList.add('active');
    } else {
      // Deactivate the "All" button visually
      const allBtn = document.querySelector('.cat-btn[onclick*="\'all\'"]');
      if (allBtn) allBtn.classList.remove('active');
      
      // If "all" was the only active thing in the array, clear it out
      if (currentFilters.categories.includes('all')) {
        currentFilters.categories = [];
      }
      
      // Toggle the value in our state array
      const index = currentFilters.categories.indexOf(value);
      if (index > -1) {
        currentFilters.categories.splice(index, 1); // Remove if already active
        buttonEl.classList.remove('active');
      } else {
        currentFilters.categories.push(value); // Add if inactive
        buttonEl.classList.add('active');
      }
      
      // If no categories are left selected, default back to "All"
      if (currentFilters.categories.length === 0) {
        currentFilters.categories = ['all'];
        if (allBtn) allBtn.classList.add('active');
      }
    }
  } else {
    // Keep 'type' row behaving like a standard radio selection
    currentFilters.type = value;
    document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('active'));
    buttonEl.classList.add('active');
  }
  
  applyFilters();
}

function applyFilters() {
  let visibleCount = 0;
  const blocks = document.querySelectorAll('.doc-block');
  
  // Pass 1: Handle Content Visibility
  blocks.forEach(block => {
    const blockCats = block.getAttribute('data-categories').split(' ');
    const blockTypes = block.getAttribute('data-types').split(' ');
    
    // Check if the item matches ANY of the selected categories
    const matchCat = currentFilters.categories.includes('all') || 
                     currentFilters.categories.some(cat => blockCats.includes(cat));
                     
    // Check if the item matches the current single type
    const matchType = (currentFilters.type === 'all') || blockTypes.includes(currentFilters.type);
    
    if (matchCat && matchType) {
      block.style.display = 'block';
      visibleCount++;
    } else {
      block.style.display = 'none';
    }
  });
  
  document.getElementById('no-match').style.display = visibleCount === 0 ? 'block' : 'none';
  
  // Pass 2: Recalculate Dynamic Counters
  updateCounters(blocks);
}

function updateCounters(blocks) {
  // Update Category Button Counters
  document.querySelectorAll('.cat-btn').forEach(btn => {
    // Extract slug from onclick function lookup attribute strings
    const onclickStr = btn.getAttribute('onclick');
    const targetCat = onclickStr.split("'")[3]; 
    let count = 0;

    blocks.forEach(block => {
      const blockCats = block.getAttribute('data-categories').split(' ');
      const blockTypes = block.getAttribute('data-types').split(' ');
      
      const matchCat = (targetCat === 'all') || blockCats.includes(targetCat);
      const matchType = (currentFilters.type === 'all') || blockTypes.includes(currentFilters.type);
      
      if (matchCat && matchType) count++;
    });
    btn.querySelector('.count').textContent = `(${count})`;
  });

  // Update Type Button Counters
  document.querySelectorAll('.type-btn').forEach(btn => {
    const onclickStr = btn.getAttribute('onclick');
    const targetType = onclickStr.split("'")[3];
    let count = 0;

    blocks.forEach(block => {
      const blockCats = block.getAttribute('data-categories').split(' ');
      const blockTypes = block.getAttribute('data-types').split(' ');
      
      const matchCat = (currentFilters.category === 'all') || blockCats.includes(currentFilters.category);
      const matchType = (targetType === 'all') || blockTypes.includes(targetType);
      
      if (matchCat && matchType) count++;
    });
    btn.querySelector('.count').textContent = `(${count})`;
  });
}

// Fire counters accurately on initial page render
document.addEventListener("DOMContentLoaded", function() {
  applyFilters();
});

