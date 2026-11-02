(() => {
  'use strict';
  const chapters = [
    ['Nền tảng làm bài', 'Bắt buộc 1', ['Đọc đề, chia mức điểm, đếm phép tính', 'Đọc, in nhanh và xử lý số lớn', 'Cách trực tiếp và đối chiếu']],
    ['Mảng một chiều', 'Bắt buộc 2', ['Mảng đếm, tần suất, vị trí cuối', 'Tổng tiền tố (và mảng hiệu)', 'Sắp xếp và tham lam đơn giản', 'Hai con trỏ, cửa sổ trượt', 'Tìm kiếm nhị phân', 'Đoạn con tổng lớn nhất / bằng k']],
    ['Số học', 'Bắt buộc 3', ['Ước, bội, duyệt đến √n', 'ƯCLN, BCNN, thuật toán Euclid', 'Số nguyên tố, sàng, phân tích thừa số', 'Chia lấy dư, lũy thừa, chu kỳ', 'Chữ số, số chính phương, đếm theo khối']],
    ['Tìm quy luật và tham lam', 'Bắt buộc 4', ['Thử nhỏ để tìm quy luật', 'Mô phỏng và gộp bước', 'Tham lam: khi nào đúng, phản ví dụ']],
    ['Xâu ký tự', 'Quan trọng', ['Duyệt ký tự, đếm 26 chữ cái', 'Đối xứng, chuẩn hóa, tách từ, nén', 'Tiền tố theo chữ cái, số lớn dạng xâu']],
    ['Quy hoạch động cơ bản', 'Quan trọng', ['Gọi lại hàm và lưu kết quả', 'Đếm số cách, đi trên lưới', 'Dãy con tăng dài nhất', 'Cái túi đơn giản, lấy hoặc không lấy']],
    ['Chiến lược làm đề', 'Tổng hợp', ['Chia thời gian và chọn phần lấy điểm', 'Đề thi thử bấm giờ']],
    ['Mở rộng cho bài cuối', 'Để sau', ['Liệt kê các cách chọn', 'Tìm đường trên lưới', 'Dãy chờ hai đầu (tùy chọn)']]
  ];
  function render() {
    const app = window.LessonApp;
    const catalog = window.LESSON_CATALOG || [{id:'1-2',href:'1-2-tong-tien-to.html',problems:4}];
    const progress = app.allProgress;
    document.getElementById('chapter-map').innerHTML = chapters.map(([name, priority, lessons], c) => `<section class="chapter"><p class="eyebrow">Chương ${c} · ${lessons.length} bài · ${lessons.filter((_,b)=>progress[c+'-'+(b+1)]?.learned).length}/${lessons.length} đã học</p><h3>${name}</h3><ol>${lessons.map((title, b) => {
      const id = c+'-'+(b+1), live = catalog.find(item=>item.id===id);
      const opening = live ? `<a class="lesson-node live" href="${app.escape(live.href)}">` : '<span class="lesson-node planned">';
      return `<li>${opening}<span>${c}.${b + 1} · ${title}</span><small>${live ? (progress[id]?.learned ? '✓ Đã học' : 'Mở bài →') : 'Sắp có'}</small>${live ? '</a>' : '</span>'}</li>`;
    }).join('')}</ol></section>`).join('');
    document.getElementById('home-progress').textContent = `${catalog.filter(item=>progress[item.id]?.learned).length}/${catalog.length} bài đã học · ${catalog.reduce((sum,item)=>sum+Object.values(progress[item.id]?.ac||{}).filter(Boolean).length,0)}/${catalog.reduce((sum,item)=>sum+item.problems,0)} bài luyện đã làm đúng`;
  }
  document.addEventListener('progresschange', render); render();
})();
