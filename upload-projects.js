/**
 * Simple project upload script
 * This script can be run in browser or Node.js environment
 */

// Override the log function for better console output
const log = function(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const icons = {
        'info': 'ℹ️',
        'success': '✅',
        'error': '❌',
        'warning': '⚠️'
    };
    
    const icon = icons[type] || 'ℹ️';
    console.log(`${icon} [${timestamp}] ${message}`);
};

// Set global log function
if (typeof window !== 'undefined') {
    window.log = log;
} else {
    globalThis.log = log;
}

async function runProjectUpload() {
    try {
        console.log('� Starting Project Upload Script');
        console.log('=' .repeat(50));
        
        // Import and run the upload function
        const { uploadAllProjects } = await import('./src/scripts/uploadProjects.js');
        
        const summary = await uploadAllProjects();
        
        console.log('');
        console.log('🎯 Final Results:');
        console.log(`   Total Projects: ${summary.totalProjects}`);
        console.log(`   ✅ Successful: ${summary.successful}`);
        console.log(`   ❌ Failed: ${summary.failed}`);
        console.log(`   📊 Success Rate: ${summary.successRate}%`);
        console.log(`   ⏱️  Total Time: ${(summary.totalTime / 1000).toFixed(2)}s`);
        
        if (summary.successful === summary.totalProjects) {
            console.log('');
            console.log('🎉 All projects uploaded successfully!');
        } else if (summary.successful > 0) {
            console.log('');
            console.log('⚠️  Upload completed with some failures');
        } else {
            console.log('');
            console.log('💥 Upload failed completely');
        }
        
        return summary;
        
    } catch (error) {
        console.error('');
        console.error('💥 Fatal error:', error.message);
        console.error('Stack trace:', error.stack);
        throw error;
    }
}

// Export for module use
export { runProjectUpload };

// Auto-run if in browser environment with specific conditions
if (typeof window !== 'undefined' && window.location.pathname.includes('upload-projects')) {
    runProjectUpload().catch(console.error);
}
