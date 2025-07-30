document.addEventListener('DOMContentLoaded', () => {
    // --- KULLANICI KİMLİK KONTROLÜ ---
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        // Eğer giriş yapılmamışsa, giriş sayfasına yönlendir
        window.location.href = 'index.html';
        return; // Kodun devamının çalışmasını engelle
    }

    // Gerekli DOM elementleri
    const addTaskBtn = document.getElementById('addTaskBtn');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const logoutBtn = document.getElementById('logoutBtn');
    const userDisplay = document.getElementById('userDisplay');
    const assigneeSelect = document.getElementById('assignee');

    // Giriş yapmış kullanıcıyı ekranda göster
    userDisplay.textContent = currentUser.charAt(0).toUpperCase();
    userDisplay.title = `${currentUser} olarak giriş yapıldı`;

    // --- Veri Yönetimi ---
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const tasksKey = `tasks_${currentUser}`; // Her kullanıcı için ayrı task listesi
    let tasks = JSON.parse(localStorage.getItem(tasksKey)) || [];

    const saveTasks = () => {
        localStorage.setItem(tasksKey, JSON.stringify(tasks));
    };
    
    // "Atanan Kişi" dropdown menüsünü doldur
    const populateAssigneeDropdown = () => {
        assigneeSelect.innerHTML = '';
        allUsers.forEach(user => {
            const option = document.createElement('option');
            option.value = user.username;
            option.textContent = user.username;
            assigneeSelect.appendChild(option);
        });
    };

    // --- GÖREVLERİ EKRENA YAZDIRMA ---
    const renderTasks = () => {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            taskList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Henüz görev oluşturulmadı.</p>';
            return;
        }
        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.dataset.id = task.id;
            const formattedDate = new Date(task.dueDate).toLocaleDateString('tr-TR', {
                day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
            });
            taskItem.innerHTML = `
                <div class="col col-name">${task.name}</div>
                <div class="col col-date">${formattedDate}</div>
                <div class="col col-creator">
                    <span class="avatar" title="${task.creator}">${task.creator.charAt(0)}</span>
                    ${task.creator}
                </div>
                <div class="col col-assignee">
                    <span class="avatar" title="${task.assignee}">${task.assignee.charAt(0)}</span>
                    ${task.assignee}
                </div>
                <div class="col col-project">${task.project || '-'}</div>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            `;
            taskList.appendChild(taskItem);
        });
    };

    // --- OLAY DİNLEYİCİLER ---
    addTaskBtn.addEventListener('click', () => {
        populateAssigneeDropdown(); // Modalı açmadan önce listeyi doldur
        modal.style.display = 'block';
    });
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target == modal) modal.style.display = 'none';
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTask = {
            id: Date.now(),
            name: document.getElementById('taskName').value,
            dueDate: document.getElementById('dueDate').value,
            creator: currentUser, // Görevi oluşturan kişi, giriş yapmış kullanıcıdır
            assignee: document.getElementById('assignee').value,
            project: document.getElementById('projectName').value
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskForm.reset();
        modal.style.display = 'none';
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const taskItem = e.target.closest('.task-item');
            const taskId = parseInt(taskItem.dataset.id);
            if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
                tasks = tasks.filter(task => task.id !== taskId);
                saveTasks();
                renderTasks();
            }
        }
    });

    // Başlangıçta görevleri render et
    renderTasks();
});