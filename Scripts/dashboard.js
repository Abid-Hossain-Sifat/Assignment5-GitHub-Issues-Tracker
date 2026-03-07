// variable 
const issueContainer = document.getElementById('issue-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('srch-btn');
const issueCountElement = document.getElementById('issue-count');
const btns = document.querySelectorAll('.tab-btn');

let allIssuesData = [];

// loading spinner 
function showDotsSpinner() {
    if (issueContainer) {
        issueContainer.innerHTML = `
            <div class="col-span-full flex justify-center items-center py-20">
                <span class="loading loading-dots loading-xl text-[#00A96E]"></span>
            </div>
        `;
    }
}

// btn
btns.forEach(btn => {
    btn.addEventListener('click', function () {
        btns.forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-outline'); });
        this.classList.add('btn-primary');
        this.classList.remove('btn-outline');
        showDotsSpinner();
        setTimeout(() => {
            const status = this.id.replace('-btn', '').toLowerCase();
            const filtered = status === 'all' ? allIssuesData : allIssuesData.filter(i => (i.status || '').toLowerCase() === status);
            displayIssues(filtered);
        }, 300);
    });
});

// Priority
function getPriorityStyles(priority) {
    const p = priority ? priority.toLowerCase() : "";
    if (p === 'high') return { bg: 'bg-[#FEECEC]', text: 'text-[#EF4444]' };
    if (p === 'medium') return { bg: 'bg-[#FFFBEB]', text: 'text-[#F59E0B]' };
    if (p === 'low') return { bg: 'bg-[#F1F5F9]', text: 'text-[#64748B]' };
    return { bg: 'bg-gray-100', text: 'text-gray-500' };
}

// Label
function getLabelStyles(label) {
    const l = label ? label.toLowerCase().trim() : "";
    if (l === 'bug') return { bg: 'bg-[#FEECEC]', text: 'text-[#EF4444]' };
    if (l === 'help wanted') return { bg: 'bg-[#F5F3FF]', text: 'text-[#8B5CF6]' };
    if (l === 'enhancement') return { bg: 'bg-[#ECFDF5]', text: 'text-[#10B981]' };
    if (l === 'good first issue') return { bg: 'bg-[#EFF6FF]', text: 'text-[#3B82F6]' };
    if (l === 'documentation') return { bg: 'bg-[#FFFBEB]', text: 'text-[#F59E0B]' };
    return { bg: 'bg-slate-100', text: 'text-slate-600' };
}

// Display Issues
function displayIssues(issues) {
    if (!issueContainer) return;
    issueContainer.innerHTML = "";

    if (issueCountElement) {
        issueCountElement.innerText = `${issues.length} Issues`;
    }

    if (!issues || issues.length === 0) {
        issueContainer.innerHTML = `<p class="text-center col-span-full py-10 text-gray-400 font-medium">No issues found.</p>`;
        return;
    }

    issues.forEach((issue) => {
        const issueId = issue._id || issue.id;
        const priorityStyle = getPriorityStyles(issue.priority);
        const isOpened = (issue.status || '').toLowerCase() === 'open';
        const borderColor = isOpened ? 'border-[#00A96E]' : 'border-[#A855F7]';
        const statusIcon = isOpened ? './assets/Open-Status.png' : './assets/Closed- Status .png';

        const div = document.createElement('div');
        div.className = "h-full";
        div.innerHTML = `
            <div class="card w-full h-full bg-white shadow-sm rounded-xl cursor-pointer hover:shadow-md transition-all border-x border-b border-slate-100" 
     style="border-top: 5px solid ${isOpened ? '#00A96E' : '#A855F7'}; border-top-left-radius: 12px; border-top-right-radius: 12px;" 
     onclick="handleCardClick('${issueId}')">
                <div class="card-body p-6">
                    <div class="flex justify-between items-center mb-4">
                        <img src="${statusIcon}" alt="status" class="w-6 h-6">
                        <span class="badge badge-md ${priorityStyle.bg} ${priorityStyle.text} border-none font-bold text-[10px] uppercase px-3 py-1 rounded-full">
                            ${issue.priority || 'Normal'}
                        </span>
                    </div>
                    <h2 class="text-xl font-bold text-[#1F2937] leading-tight mb-2">${issue.title || 'Untitled'}</h2>
                    <p class="text-sm font-medium mb-4 line-clamp-2 text-[#64748B]">${issue.description || 'No description provided.'}</p>
                    <div class="flex gap-2 flex-wrap mt-auto">
                        ${issue.labels ? issue.labels.map(label => {
            const s = getLabelStyles(label);
            return `<span class="${s.bg} ${s.text} py-1 px-3 rounded-full font-bold text-[10px] uppercase border border-white/50">${label}</span>`;
        }).join('') : ''}
                    </div>
                    <div class="divider my-4 opacity-50"></div>
                    <div class="flex justify-between items-end text-[#64748B] text-xs">
                        <div>
                            <p class="font-bold text-[#1F2937]">#${issueId.toString().slice(-6)} by ${issue.author || 'User'}</p>
                            <p class="mt-1">${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-GB') : 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>`;
        issueContainer.appendChild(div);
    });
}

// Single issue detail with Loading
window.handleCardClick = function (id) {
    if (!id || id === 'undefined') return;

    const modal = document.getElementById('issue_modal');
    const modalContent = document.getElementById('modal-content');

    // Show dots spinner in modal
    modalContent.innerHTML = `
        <div class="flex justify-center py-20">
            <span class="loading loading-dots loading-xl text-[#00A96E]"></span>
        </div>`;
    modal.showModal();

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
        .then(res => res.json())
        .then(response => {
            const issue = response.data || response;
            if (!issue || !issue.title) throw new Error("Not found");

            const pStyle = getPriorityStyles(issue.priority);
            const isOpened = (issue.status || '').toLowerCase() === 'open';

            modalContent.innerHTML = `
                <div class="space-y-4 text-left">
                    <h2 class="text-2xl font-bold text-[#1F2937] leading-tight">${issue.title}</h2>
                    <div class="flex items-center gap-2 text-sm text-[#64748B]">
                        <span class="${isOpened ? 'bg-[#00A96E]' : 'bg-[#A855F7]'} text-white px-3 py-1 rounded-full text-[11px] font-semibold">
                            ${isOpened ? 'Opened' : 'Closed'}
                        </span>
                        <span>• Opened by <span class="font-bold text-[#1F2937]">${issue.author}</span></span>
                        <span>• ${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-GB') : '22/02/2026'}</span>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-4">
                        ${issue.labels ? issue.labels.map(l => {
                const s = getLabelStyles(l);
                return `<span class="${s.bg} ${s.text} py-1 px-3 rounded-full font-bold text-[10px] uppercase border border-slate-50">${l}</span>`;
            }).join('') : ''}
                    </div>
                    <p class="text-[#64748B] text-base leading-relaxed mt-6">${issue.description}</p>
                    <div class="grid grid-cols-2 gap-4 mt-8 bg-[#F8FAFC] p-5 rounded-xl border border-slate-50">
                        <div>
                            <p class="text-[11px] text-[#94A3B8] font-bold uppercase mb-2">Assignee:</p>
                            <p class="font-bold text-[#1F2937] text-sm">${issue.author}</p>
                        </div>
                        <div>
                            <p class="text-[11px] text-[#94A3B8] font-bold uppercase mb-2">Priority:</p>
                            <span class="${pStyle.bg} ${pStyle.text} px-4 py-1.5 rounded-full text-[10px] font-black uppercase">
                                ${issue.priority || 'NORMAL'}
                            </span>
                        </div>
                    </div>
                </div>
            `;
        })
        .catch(() => {
            modalContent.innerHTML = `
                <div class="text-center py-10">
                    <h3 class="text-xl font-bold text-red-500 mb-2">Issue details not found!</h3>
                    <p class="text-slate-500 text-sm">Server Error occurred.</p>
                </div>
            `;
        });
};

// data load 
const loadData = () => {
    showDotsSpinner();
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
        .then(res => res.json())
        .then(data => {
            allIssuesData = data.data || data;
            displayIssues(allIssuesData);
        })
        .catch(err => {
            console.error("API Error:", err);
            if (issueContainer) issueContainer.innerHTML = `<p class="text-error text-center col-span-full py-10">No Issue.</p>`;
        });
};

// Search
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const val = searchInput.value.toLowerCase().trim();

        if (!val) {
            displayIssues(allIssuesData);
            return;
        }

        showDotsSpinner();

        fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${val}`)
            .then(res => res.json())
            .then(data => {
                const searchResult = data.data || data;
                displayIssues(searchResult);
            })
            .catch(err => {
                console.error("Search Error:", err);
                issueContainer.innerHTML = `<p class="text-error text-center col-span-full py-10">Search failed.</p>`;
            });
    });
}

loadData();