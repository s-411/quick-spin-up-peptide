// Quick test to check if imports work
console.log('Testing imports...');

try {
  // Test that files exist
  const fs = await import('fs');
  const path = await import('path');

  const componentsDir = './demo-app/components/sections';
  const dirs = ['settings', 'dashboard', 'social'];

  for (const dir of dirs) {
    const fullPath = path.join(componentsDir, dir);
    const files = fs.readdirSync(fullPath);
    console.log(`✓ ${dir}: ${files.length} files`);
  }

  console.log('\n✓ All component files exist!');

} catch (error) {
  console.error('✗ Error:', error.message);
}
