import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class PdfLoader {
  private readonly ele: HTMLElement;
  private readonly contentElement: HTMLElement;
  private readonly footer: HTMLElement;
  private pdfFileName: string;
  private readonly splitClassName: string;
  private readonly A4_WIDTH: number;
  private readonly A4_HEIGHT: number;

  constructor(props: {
    contentElement: HTMLElement;
    footer: HTMLElement;
    pdfFileName: string;
    splitClassName: string;
    ele: HTMLElement;
  }) {
    const { footer, contentElement, ele, pdfFileName, splitClassName } = props;
    this.ele = ele;
    this.contentElement = contentElement;
    this.pdfFileName = pdfFileName;
    this.splitClassName = splitClassName;
    this.A4_WIDTH = 595.28;
    this.A4_HEIGHT = 841.89;
    this.footer = footer;
  }

  async createCanvasData(
    element: HTMLElement,
    contentElement: { scrollHeight: number }
  ) {
    if (contentElement) {
      return await html2canvas(element, {
        height: contentElement.scrollHeight + 50,
        windowHeight: contentElement.scrollHeight + 50,
        allowTaint: true,
        useCORS: true //允许canvas画布内可以跨域请求外部链接图片, 允许跨域请求。
      });
    }
    return await html2canvas(element, {
      height: this.ele.scrollHeight + 10,
      windowHeight: this.ele.scrollHeight + 10,
      useCORS: true //允许canvas画布内可以跨域请求外部链接图片, 允许跨域请求。
    });
  }

  async addFooter(pdf: jsPDF, totalPage: number, currentPage: number) {
    const totalPageElement = this.footer.querySelector('.total_page');
    const currentPageElement = this.footer.querySelector('.current_page');
    if (totalPageElement) {
      totalPageElement.innerHTML = `共${totalPage}页`;
    }
    if (currentPageElement) {
      currentPageElement.innerHTML = `第${currentPage}页`;
    }
    const canvasData = await html2canvas(this.footer);
    // const height = this.footer.clientHeight;
    const contentWidth = canvasData.width;
    const contentHeight = canvasData.height;
    //a4纸的尺寸[595,842],单位像素，html页面生成的canvas在pdf中图片的宽高
    const imgWidth = this.A4_WIDTH; //-10为了页面有右边距
    const imgHeight = (this.A4_WIDTH / contentWidth) * contentHeight;
    const pageData = canvasData.toDataURL('image/jpeg', 1.0);
    pdf.addImage(
      pageData,
      'JPEG',
      0,
      this.A4_HEIGHT - imgHeight,
      imgWidth,
      imgHeight
    );
  }

  async getPDF(resolve: (value: PromiseLike<unknown> | unknown) => void) {
    const ele = this.ele;
    const pdfFileName = this.pdfFileName;
    const eleW = ele.offsetWidth; // 获得该容器的宽
    const eleH = ele.scrollHeight; // 获得该容器的高
    const eleOffsetTop = ele.offsetTop; // 获得该容器到文档顶部的距离
    const eleOffsetLeft = ele.offsetLeft; // 获得该容器到文档最左的距离
    const canvas = document.createElement('canvas');
    let abs = 0;
    const win_in =
      document.documentElement.clientWidth || document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
    const win_out = window.innerWidth; // 获得当前窗口的宽度（包含滚动条）
    if (win_out > win_in) {
      abs = (win_out - win_in) / 2; // 获得滚动条宽度的一半
    }
    canvas.width = eleW * 2; // 将画布宽&&高放大两倍
    canvas.height = eleH * 2;
    const context = canvas.getContext('2d');
    if (context) {
      context.scale(2, 2); // 增强图片清晰度
      context.translate(-eleOffsetLeft - abs, -eleOffsetTop);
    }
    const canvasData = await this.createCanvasData(
      this.ele,
      this.contentElement
    );
    console.log('canvas是');
    console.log(canvasData);
    const contentWidth = canvasData.width;
    const contentHeight = canvasData.height;
    //一页pdf显示html页面生成的canvas高度;
    const pageHeight = (contentWidth / this.A4_WIDTH) * this.A4_HEIGHT; // 这样写的目的在于保持宽高比例一致 pageHeight/canvas.width = a4纸高度/a4纸宽度// 宽度和canvas.width保持一致
    //未生成pdf的html页面高度
    let leftHeight = contentHeight;
    //页面偏移
    let position = 0;
    //a4纸的尺寸[595,842],单位像素，html页面生成的canvas在pdf中图片的宽高
    const imgWidth = this.A4_WIDTH; //-10为了页面有右边距
    const imgHeight = (this.A4_WIDTH / contentWidth) * contentHeight;
    const pageData = canvasData.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      unit: 'pt',
      format: 'a4',
      orientation: 'p'
    });
    //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
    //当内容未超过pdf一页显示的范围，无需分页
    console.log(leftHeight);
    console.log(pageHeight);
    if (leftHeight < pageHeight) {
      //在pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置在pdf中显示；
      pdf.addImage(pageData, 'JPEG', 5, 0, imgWidth, imgHeight);
      // pdf.addImage(pageData, 'JPEG', 20, 40, imgWidth, imgHeight);
    } else {
      // 分页
      let currentPage = 1;
      const totalPage = Math.ceil(leftHeight / pageHeight);
      while (leftHeight > 0) {
        pdf.addImage(pageData, 'JPEG', 5, position, imgWidth, imgHeight);
        leftHeight -= pageHeight;
        position -= this.A4_HEIGHT;
        //避免添加空白页
        if (leftHeight > 0) {
          await this.addFooter(pdf, totalPage, currentPage);
          pdf.addPage();
          currentPage++;
        }
        await this.addFooter(pdf, totalPage, currentPage);
      }
    }

    pdf.save(pdfFileName + '.pdf', { returnPromise: true }).then(() => {
      //去除添加的空div 防止页面混乱
      const doms = document.querySelectorAll('.emptyDiv');
      for (let i = 0; i < doms.length; i++) {
        doms[i].remove();
      }
    });
    this.ele.style.height = '';
    resolve('success');
  }

  async outPutPdfFn(pdfFileName: string) {
    return new Promise((resolve) => {
      this.ele.style.height = 'initial';
      pdfFileName ? (this.pdfFileName = pdfFileName) : null;
      const target = this.ele;
      const pageHeight = (target.scrollWidth / this.A4_WIDTH) * this.A4_HEIGHT;
      // 获取分割dom，此处为class类名为item的dom
      const domList = document.getElementsByClassName(this.splitClassName);
      // 进行分割操作，当dom内容已超出a4的高度，则将该dom前插入一个空dom，把他挤下去，分割
      let pageNum = 1; //pdf页数
      const eleBounding = this.ele.getBoundingClientRect();
      for (let i = 0; i < domList.length; i++) {
        const node = domList[i];
        const bound = node.getBoundingClientRect();
        const offset2Ele = bound.top - eleBounding.top;
        const currentPage = Math.ceil(
          (bound.bottom - eleBounding.top) / pageHeight
        ); //当前元素应该在哪一页
        if (pageNum < currentPage) {
          pageNum++;
          const divParent = domList[i].parentNode; // 获取该div的父节点
          const newNode = document.createElement('div');
          newNode.className = 'emptyDiv';
          newNode.style.background = 'white';
          newNode.style.height =
            pageHeight * (pageNum - 1) - offset2Ele + 30 + 'px'; //+30为了在换下一页时有顶部的边距
          newNode.style.width = '100%';
          const next = domList[i].nextSibling; // 获取div的下一个兄弟节点
          // 判断兄弟节点是否存在
          if (next) {
            // 存在则将新节点插入到div的下一个兄弟节点之前，即div之后
            divParent?.insertBefore(newNode, node);
          } else {
            // 不存在则直接添加到最后,appendChild默认添加到divParent的最后
            divParent?.appendChild(newNode);
          }
        }
      }
      // 异步函数，导出成功后处理交互
      this.getPDF(resolve);
    });
  }
}

export default PdfLoader;
