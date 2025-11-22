const parseRequirements = (requirementsHtml) => {
    const specs = {
        min: { cpu: null, ram: null, gpu: null, storage: null },
        rec: { cpu: null, ram: null, gpu: null, storage: null }
    };

    if (!requirementsHtml) return specs;

    const extractRam = (text) => {
        const match = text.match(/(\d+)\s*GB/i);
        return match ? parseInt(match[1]) : null;
    };

    const extractString = (text, key) => {
        const regex = new RegExp(`${key}:\\s*([^<]+)`, 'i');
        const match = text.match(regex);
        return match ? match[1].trim() : null;
    };

    const extractStorage = (text) => {
        // Match "50 GB available space" or similar
        const match = text.match(/(\d+)\s*GB\s*available/i);
        return match ? parseInt(match[1]) : null;
    };

    if (requirementsHtml.minimum) {
        specs.min.ram = extractRam(requirementsHtml.minimum);
        specs.min.cpu = extractString(requirementsHtml.minimum, 'Processor');
        specs.min.gpu = extractString(requirementsHtml.minimum, 'Graphics');
        specs.min.storage = extractStorage(requirementsHtml.minimum);
    }
    if (requirementsHtml.recommended) {
        specs.rec.ram = extractRam(requirementsHtml.recommended);
        specs.rec.cpu = extractString(requirementsHtml.recommended, 'Processor');
        specs.rec.gpu = extractString(requirementsHtml.recommended, 'Graphics');
        specs.rec.storage = extractStorage(requirementsHtml.recommended);
    }

    return specs;
};

const compareSpecs = (userSpecs, gameRequirements) => {
    const result = {
        suitable: 'unknown',
        reason: [],
        details: {
            cpu: { status: 'unknown', user: 'Unknown', required: 'Unknown' },
            ram: { status: 'unknown', user: 'Unknown', required: 'Unknown' },
            gpu: { status: 'unknown', user: 'Unknown', required: 'Unknown' },
            storage: { status: 'unknown', user: 'Unknown', required: 'Unknown' }
        },
        estimatedSettings: 'Unknown'
    };

    const parsedReqs = parseRequirements(gameRequirements);

    // Normalize user specs
    let userRam = 0;
    let userCpu = 'Unknown';
    let userGpu = 'Unknown';
    let userStorage = 0; // in GB

    if (userSpecs.ram && userSpecs.ram.total) {
        userRam = parseFloat(userSpecs.ram.total);
    } else if (userSpecs.memory && userSpecs.memory.total) {
        userRam = parseFloat(userSpecs.memory.total);
    }
    if (isNaN(userRam)) userRam = 0;

    if (userSpecs.cpu) {
        userCpu = userSpecs.cpu.brand || userSpecs.cpu.processor || 'Unknown';
    }

    if (userSpecs.gpu) {
        if (Array.isArray(userSpecs.gpu) && userSpecs.gpu.length > 0) {
            userGpu = userSpecs.gpu.map(g => g.name || g.model || 'Unknown GPU').join(', ');
        } else if (userSpecs.gpu.model) {
            userGpu = userSpecs.gpu.model;
        }
    }

    // Storage (Scanner returns array of disks, we sum free space or take C:)
    if (userSpecs.disk && Array.isArray(userSpecs.disk)) {
        // Find C: or largest free space
        const cDrive = userSpecs.disk.find(d => d.mountpoint === 'C:\\' || d.mountpoint === '/');
        const targetDisk = cDrive || userSpecs.disk[0];
        if (targetDisk) {
            userStorage = parseFloat(targetDisk.free); // Scanner sends "33.53GB"
            if (isNaN(userStorage)) userStorage = 0;
        }
    } else if (userSpecs.storage && userSpecs.storage.free) {
        userStorage = parseFloat(userSpecs.storage.free);
    }

    // Populate result details with text
    result.details.cpu.user = userCpu;
    result.details.cpu.required = parsedReqs.min.cpu || 'Not specified';

    result.details.gpu.user = userGpu;
    result.details.gpu.required = parsedReqs.min.gpu || 'Not specified';

    result.details.ram.user = `${userRam.toFixed(1)} GB`;
    result.details.ram.required = parsedReqs.min.ram ? `${parsedReqs.min.ram} GB` : 'Not specified';

    result.details.storage.user = `${userStorage.toFixed(1)} GB Free`;
    result.details.storage.required = parsedReqs.min.storage ? `${parsedReqs.min.storage} GB` : 'Not specified';

    // RAM Check
    if (parsedReqs.min.ram) {
        if (userRam < parsedReqs.min.ram) {
            result.suitable = 'not suitable';
            result.reason.push(`Insufficient RAM: You have ${userRam.toFixed(1)}GB, game needs ${parsedReqs.min.ram}GB.`);
            result.details.ram.status = 'fail';
        } else if (parsedReqs.rec.ram && userRam >= parsedReqs.rec.ram) {
            result.details.ram.status = 'pass';
        } else {
            result.details.ram.status = 'borderline';
        }
    } else {
        result.details.ram.status = 'unknown';
    }

    // Storage Check
    if (parsedReqs.min.storage) {
        if (userStorage < parsedReqs.min.storage) {
            result.reason.push(`Insufficient Storage: You have ${userStorage.toFixed(1)}GB free, game needs ${parsedReqs.min.storage}GB.`);
            result.details.storage.status = 'fail';
        } else {
            result.details.storage.status = 'pass';
        }
    } else {
        result.details.storage.status = 'unknown';
    }

    // CPU/GPU Logic (Placeholder)
    if (result.details.ram.status !== 'fail') {
        result.details.cpu.status = 'borderline';
        result.details.gpu.status = 'borderline';
    } else {
        result.details.cpu.status = 'fail';
        result.details.gpu.status = 'fail';
    }

    // Overall Suitability
    if (result.details.ram.status === 'fail' || result.details.storage.status === 'fail') {
        result.suitable = 'not suitable';
        result.estimatedSettings = 'Unplayable';
    } else if (result.details.ram.status === 'pass' && result.details.storage.status === 'pass') {
        result.suitable = 'suitable';
        result.estimatedSettings = 'High / Ultra @ 1080p';
    } else {
        result.suitable = 'borderline';
        result.estimatedSettings = 'Low / Medium @ 720p/1080p';
    }

    return result;
};

module.exports = {
    compareSpecs
};
