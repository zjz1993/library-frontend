import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class NewPdfLoader {
  private readonly ele: HTMLElement;
  private readonly contentElement: HTMLElement;
  private readonly footer: HTMLElement;
  private pdfFileName: string | undefined;
  private readonly A4_WIDTH: number;
  private readonly A4_HEIGHT: number;
  private tHeadHeight: number;

  constructor(props: {
    tHeadHeight: number;
    contentElement: HTMLElement;
    footer: HTMLElement;
    ele: HTMLElement;
  }) {
    const { tHeadHeight, footer, contentElement, ele } = props;
    this.ele = ele;
    this.tHeadHeight = tHeadHeight;
    this.contentElement = contentElement;
    this.A4_WIDTH = 595.28;
    this.A4_HEIGHT = 841.89;
    this.footer = footer;
  }

  async createCanvasData(element: HTMLElement, contentElement: HTMLElement) {
    if (contentElement) {
      return await html2canvas(element, {
        height: contentElement.scrollHeight,
        windowHeight: contentElement.scrollHeight,
        allowTaint: true,
        useCORS: true //允许canvas画布内可以跨域请求外部链接图片, 允许跨域请求。
      });
    }
    return await html2canvas(element, {
      height: this.ele.scrollHeight,
      windowHeight: this.ele.scrollHeight,
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
    const contentWidth = canvasData.width;
    const contentHeight = canvasData.height;
    console.log('contentWidth是');
    console.log(contentHeight);
    //一页pdf显示html页面生成的canvas高度;
    const pageHeight = (contentWidth / this.A4_WIDTH) * this.A4_HEIGHT; // 这样写的目的在于保持宽高比例一致 pageHeight/canvas.width = a4纸高度/a4纸宽度// 宽度和canvas.width保持一致
    //未生成pdf的html页面高度
    let leftHeight = contentHeight;
    //页面偏移
    let position = 0;
    //a4纸的尺寸[595,842],单位像素，html页面生成的canvas在pdf中图片的宽高
    const imgWidth = this.A4_WIDTH; //-10为了页面有右边距
    const imgHeight = (this.A4_WIDTH / contentWidth) * (contentHeight - 50);
    const pageData = canvasData.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      unit: 'pt',
      format: 'a4',
      orientation: 'p'
    });
    //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
    //当内容未超过pdf一页显示的范围，无需分页
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

    pdf.save(this.pdfFileName + '.pdf', { returnPromise: true }).then(() => {
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
      // 异步函数，导出成功后处理交互
      this.getPDF(resolve);
    });
  }

  async calcMaxHeight() {
    console.log('计算了');
    const element = this.ele;
    const contentElement = this.contentElement;
    let page = 0;
    let lastMarginBottom = 0;
    const borderDomHeight = parseFloat(getComputedStyle(element).height);
    const borderDomWidth = parseFloat(getComputedStyle(element).width);
    const borderTop = element.getBoundingClientRect().top;
    const pageHeight = (borderDomWidth / this.A4_WIDTH) * this.A4_HEIGHT;
    const closeDomArray: {
      element: Element;
      id?: string;
      height: number;
      top: number;
      marginBottom: number;
      marginTop?: number;
      tableIndex: number;
    }[][] = [[]];
    console.log(`borderDomWidth是${borderDomWidth}`);
    console.log(`borderDomHeight是${borderDomHeight}`);
    console.log(`pageHeight是${pageHeight}`);

    const getElementTopAndBottom = (element: Element) => {
      const top = element.getBoundingClientRect().top - borderTop;
      const height = parseFloat(getComputedStyle(element).height);
      const bottom = height + top;
      return {
        top,
        bottom,
        height
      };
    };

    const traverseDOM = (element: HTMLElement) => {
      // 获取当前节点的高度
      if (
        element.nodeType === Node.ELEMENT_NODE &&
        element !== contentElement &&
        element.tagName === 'TR'
      ) {
        const position = getElementTopAndBottom(element);
        const top = position.top;
        const bottom = position.bottom;
        const calcPageHeight =
          (page + 1) * pageHeight -
          (closeDomArray.length - 1) * this.tHeadHeight -
          lastMarginBottom;
        if (!isNaN(bottom)) {
          if (top < calcPageHeight && bottom > calcPageHeight) {
            console.log('在这个dom时分页了');
            console.log(element);
            console.log('他的上一个兄弟元素是');
            console.log(element.previousSibling);
            console.log(`oldGap是:${lastMarginBottom}`);
            const previousSiblingElement = element.previousElementSibling;

            if (previousSiblingElement) {
              const firstElement =
                previousSiblingElement.parentElement?.firstElementChild;
              console.log('firstElement是');
              console.log(firstElement);
              const previousSiblingElementPosition = getElementTopAndBottom(
                previousSiblingElement
              );
              console.log('closeDomArray是');
              console.log(closeDomArray);
              console.log(page);
              if (closeDomArray[page].length === 0) {
                console.log('此时closeDomArray是');
                console.log(closeDomArray);
                closeDomArray[page].push({
                  element: previousSiblingElement,
                  tableIndex:
                    previousSiblingElement instanceof HTMLElement
                      ? Number(previousSiblingElement.dataset.tableIndex)
                      : 0,
                  id:
                    previousSiblingElement instanceof HTMLElement
                      ? previousSiblingElement.dataset.rowKey
                      : '',
                  height: firstElement
                    ? previousSiblingElementPosition.bottom -
                      getElementTopAndBottom(firstElement).top +
                      this.tHeadHeight
                    : previousSiblingElementPosition.bottom,
                  top: previousSiblingElementPosition.top,
                  marginBottom:
                    (page + 1) * pageHeight -
                    (closeDomArray.length - 1) * this.tHeadHeight -
                    lastMarginBottom -
                    previousSiblingElementPosition.bottom
                });
              } else {
                const oldCloseItem = closeDomArray[page][0];
                if (
                  previousSiblingElementPosition.bottom -
                    previousSiblingElementPosition.top <
                  oldCloseItem.height
                ) {
                  console.log('有更小的 此时closeDomArray是');
                  console.log(closeDomArray);
                  closeDomArray[page][0] = {
                    id:
                      previousSiblingElement instanceof HTMLElement
                        ? previousSiblingElement.dataset.rowKey
                        : '',
                    tableIndex:
                      previousSiblingElement instanceof HTMLElement
                        ? Number(previousSiblingElement.dataset.tableIndex)
                        : 0,
                    element: previousSiblingElement,
                    height: firstElement
                      ? previousSiblingElementPosition.bottom -
                        getElementTopAndBottom(firstElement).top +
                        this.tHeadHeight
                      : previousSiblingElementPosition.bottom,
                    top: previousSiblingElementPosition.top,
                    marginBottom:
                      (page + 1) * pageHeight -
                      (closeDomArray.length - 1) * this.tHeadHeight -
                      lastMarginBottom -
                      previousSiblingElementPosition.bottom
                  };
                }
              }
              lastMarginBottom =
                (page + 1) * pageHeight -
                (closeDomArray.length - 1) * this.tHeadHeight -
                previousSiblingElementPosition.bottom;
            } else {
              // 没上一个兄弟元素了,需要找到这个元素所属的表格的表头
              console.log(
                '没上一个兄弟元素了,需要找到这个元素所属的表格的表头 page是'
              );
              const tbodyElement = element.parentElement;
              if (tbodyElement) {
                const tableElement = tbodyElement.parentElement as HTMLElement;
                const tableElementPosition =
                  getElementTopAndBottom(tableElement);
                console.log('tableElementPosition是');
                console.log(tableElementPosition);
                closeDomArray[page].push({
                  element: tableElement,
                  height: tableElementPosition.bottom,
                  top: tableElementPosition.top,
                  tableIndex: 0,
                  marginTop:
                    tableElementPosition.bottom > calcPageHeight
                      ? calcPageHeight - tableElementPosition.top
                      : 0,
                  marginBottom: calcPageHeight - tableElementPosition.bottom
                });
              }
            }
            //if (closeDomArray[page].length === 0) {
            //  closeDomArray[page].push({
            //    id: element,
            //    height: bottom - top,
            //    top,
            //    gap: (page + 1) * pageHeight - page * 55 - top - oldGap
            //  });
            //} else {
            //  const oldCloseItem = closeDomArray[page][0];
            //  if (bottom - top < oldCloseItem.height) {
            //    closeDomArray[page][0] = {
            //      id: element,
            //      height: bottom - top,
            //      top,
            //      gap: (page + 1) * pageHeight - page * 55 - top - oldGap
            //    };
            //  }
            //}
            //oldGap =
            //  (page + 1) * pageHeight -
            //  page * 55 -
            //  previousSiblingElementPosition.top;
          }
          if (top > calcPageHeight && bottom > calcPageHeight) {
            console.log('page+1');
            closeDomArray.push([]);
            page++;
          }
        }
      }
      // 遍历当前节点的子节点
      const children = element.childNodes;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
          // 递归调用遍历函数，处理子节点
          traverseDOM(child as HTMLElement);
        }
      }
    };

    traverseDOM(contentElement);
    return closeDomArray;
  }
}

export default NewPdfLoader;
