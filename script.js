document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    // Örnek Oluşturan Kişi (Sabit)
    const CREATOR_NAME = "Salihcan Boyuer";

    // Tarayıcı hafızasından görevleri yükle veya boş bir dizi ile başla
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [
        {
            id: 1,
            name: "Gelen İş Başvurularına Society Davet Maili Gönderilmesi",
            dueDate: "2025-07-30T19:00",
            creator: "Salihcan Boyuer",
            assignee: "Ekin Deviren",
            project: "İnsan Kaynakları"
        },
        {
            id: 2,
            name: "Alternatif CRM Sistemi Araştırması",
            dueDate: "2025-08-01T23:59",
            creator: "Salihcan Boyuer",
            assignee: "Ekin Deviren",
            project: "Yazılım Geliştirme"
        }
    ];

    // Görevleri localStorage'a kaydetme fonksiyonu
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Görevleri ekrana render etme fonksiyonu
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
                    <span class="avatar">${task.creator.charAt(0)}</span>
                    ${task.creator}
                </div>
                <div class="col col-assignee">
                    <span class="avatar">${task.assignee.charAt(0)}</span>
                    ${task.assignee}
                </div>
                <div class="col col-project">${task.project || '-'}</div>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            `;
            taskList.appendChild(taskItem);
        });
    };

    // Modal açma/kapama
    addTaskBtn.addEventListener('click', () => modal.style.display = 'block');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Yeni görev formu gönderildiğinde
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newTask = {
            id: Date.now(), // Benzersiz bir ID oluştur
            name: document.getElementById('taskName').value,
            dueDate: document.getElementById('dueDate').value,
            creator: CREATOR_NAME,
            assignee: document.getElementById('assignee').value,
            project: document.getElementById('projectName').value
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        
        taskForm.reset();
        modal.style.display = 'none';
    });

    // Görev silme
    taskList.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const taskItem = e.target.closest('.task-item');
            const taskId = parseInt(taskItem.dataset.id);
            
            // Kullanıcıdan onay al
            const isConfirmed = confirm('Bu görevi silmek istediğinizden emin misiniz?');
            if(isConfirmed) {
                tasks = tasks.filter(task => task.id !== taskId);
                saveTasks();
                renderTasks();
            }
        }
    });

    // Başlangıçta görevleri render et
    renderTasks();
});