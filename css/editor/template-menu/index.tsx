import { RefObject } from 'react'
import {
  EditorContentState,
  OptionMenuItemState,
  OptionMenuTypeState,
  useEditorStore,
} from '@/stores/editor-store'
import { useTranslation } from 'react-i18next'
import { updateAlpha, getLabelPriceUnit } from '@/utils/editor-utils'
import DraggableResizable from '@/components/atoms/editor/draggable-resizable/index'
import styles from './index.module.css'
import React from 'react'
import MenuV2 from './index.v2'

interface MenuItemProps {
  id: number
  editContent: EditorContentState
  parentRef: RefObject<HTMLDivElement>
  isPreview?: boolean
  isMasterLock?: boolean
}

interface OptionStyleState {
  fontFamily: string
  fontSize: string
  fontWeight: string
  fontStyle: string
  textDecoration: string
  color: string
  backgroundColor: string
  textAlign: 'left' | 'right' | 'center'
}

const MenuItem: React.FC<MenuItemProps> = ({
  id,
  editContent,
  parentRef,
  isPreview,
  isMasterLock = false,
}) => {
  const { t } = useTranslation()

  const es = useEditorStore()
  const version = es.getEditorOptionMenuVersion(id)
  if (version === 'v2')
    return (
      <MenuV2
        id={id}
        editContent={editContent}
        parentRef={parentRef}
        isPreview={isPreview}
        isMasterLock={isMasterLock}
      />
    )

  const flipHorizontal = es.getEditorFlipHorizontal(id)
  const flipVertical = es.getEditorFlipVertical(id)

  const { currentScene } = es
  const { option_menu, option_menu_table } = editContent

  const menu_list: OptionMenuItemState[] =
    option_menu?.menu_item?.menu_list || []
  const menu_column = option_menu?.column || '1'
  const menu_option_list = option_menu?.menu_option

  const name_option = menu_option_list?.find(
    (option: OptionMenuTypeState) => option.text_type === 'Menu Name',
  )
  const desc_option = menu_option_list?.find(
    (option: OptionMenuTypeState) => option.text_type === 'Description',
  )
  const price_option = menu_option_list?.find(
    (option: OptionMenuTypeState) => option.text_type === 'Price',
  )

  /* 칼로리 알러지 - 현재 템플릿에 없음 */
  const cal_option = menu_option_list?.find(
    (option: OptionMenuTypeState) => option.text_type === 'Calories',
  )
  const allergy_option = menu_option_list?.find(
    (option: OptionMenuTypeState) => option.text_type === 'Allergies',
  )

  // const allergyList = [
  //   { label: t('pssc.device.broadcast.go.none'), value: 'none' },
  //   { label: t('pssc.mycontent.allergy.milk'), value: 'milk' },
  //   { label: t('pssc.mycontent.allergy.nuts'), value: 'nuts' },
  //   { label: t('pssc.mycontent.allergy.eggs'), value: 'eggs' },
  //   { label: t('pssc.mycontent.allergy.peanuts'), value: 'peanuts' },
  //   { label: t('pssc.mycontent.allergy.fish'), value: 'fish' },
  //   { label: t('pssc.mycontent.allergy.wheat'), value: 'wheat' },
  //   { label: t('pssc.mycontent.allergy.shellfish'), value: 'shellfish' },
  //   { label: t('pssc.mycontent.allergy.soybeans'), value: 'soybeans' },
  //   { label: t('pssc.mycontent.allergy.sesame'), value: 'sesame' },
  // ]

  // const getAllergyLabel = (value: string) => {
  //   console.log('getAllergyLabel -- value', value)
  //   const allergy = allergyList.find((item) => item.value === value)
  //   return allergy ? allergy.label : null
  // }

  const getFlipStyle = () => {
    const s = {}
    if (flipHorizontal && flipVertical) {
      s['transform'] = 'scaleX(-1) scaleY(-1)'
    } else if (flipHorizontal) {
      s['transform'] = 'scaleX(-1)'
    } else if (flipVertical) {
      s['transform'] = 'scaleY(-1)'
    }
    return s
  }

  const style: OptionStyleState = {
    fontFamily: 'Noto Sans',
    fontSize: '20px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: '',
    color: 'rgb(0,0,0)',
    backgroundColor: 'rgba(255,255,255,0)',
    textAlign: 'left',
  }

  const getStyle = (option: OptionMenuTypeState): React.CSSProperties => {
    return {
      fontFamily: option.font,
      fontSize: option.text_size + 'px',
      fontWeight: option.style_bold ? 'bold' : 'normal',
      fontStyle: option.style_italic ? 'italic' : 'normal',
      textDecoration: `${option.style_under ? 'underline ' : ''}${option.style_cancel ? 'line-through' : ''}`,
      // color: `rgb(${option.text_color})`,
      // backgroundColor: `rgba(${option.back_color}, ${option.opacity})`,
      color: `${option.text_color}`,
      backgroundColor: updateAlpha(option.back_color, option.opacity),
      textAlign: (option.align || 'left') as 'left' | 'center' | 'right',
    }
  }

  const getImageList = (menu_id: string) => {
    if (!editContent.option_menu?.menu_item) return []

    const imageList = editContent.option_menu.menu_item.image
    const filteredImageList = imageList.filter(
      (item) => item.menu_id === menu_id,
    )

    return filteredImageList
  }

  // const [isImage, setIsImage] = useState(false)

  const menu_type = editContent.template_menu_type || ''
  const name_style = name_option ? getStyle(name_option) : style
  const desc_style = desc_option ? getStyle(desc_option) : style
  const price_style = price_option ? getStyle(price_option) : style
  const allergy_style = allergy_option ? getStyle(allergy_option) : style
  const calory_style = cal_option ? getStyle(cal_option) : style

  const renderTable = (item: OptionMenuItemState) => {
    if (editContent.scene_no !== currentScene) return

    const images = getImageList(item.id)
    const price_type = option_menu?.menu_item?.price_type

    if (menu_type.includes('01')) {
      if (option_menu_table?.layout_type === 'H') {
        return (
          <table
            className={styles.tempTable}
            style={{ width: '100%', height: '100%', ...getFlipStyle() }}
          >
            <tbody>
              <tr>
                {images.length > 0 && (
                  <td
                    rowSpan={3}
                    className="image-cell"
                    style={{ width: `${images.length > 0 ? '20%' : ''}` }}
                  >
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image.img_url}
                        alt={t('pssc.device.content.thumbnail.alt', {
                          title: image.content_name,
                        })}
                      />
                    ))}
                  </td>
                )}

                {option_menu_table?.dash?.position === 'name' ? (
                  <td
                    className="text-line"
                    style={{ width: `${option_menu_table?.name_w}%` }}
                  >
                    <div>
                      <span
                        className={`${styles.menuName} ${option_menu_table?.dash?.position === 'name' ? '' : styles.w100}`}
                        style={name_style}
                      >
                        {item.menu_name}
                      </span>
                      <hr
                        style={{
                          borderTop: `${option_menu_table.dash.style} ${option_menu_table.dash.style ? name_style.color : ''}`,
                        }}
                      />
                    </div>
                  </td>
                ) : (
                  <td
                    className="text-line"
                    style={{
                      width: `${option_menu_table?.name_w}%`,
                      ...name_style,
                    }}
                  >
                    {item.menu_name}
                  </td>
                )}

                {/* ===== Price ===== */}
                {price_type === '1' ? (
                  <td
                    className="text-line"
                    //style={{ width: `${option_menu_table?.price_w}%` }}
                  >
                    <div>
                      {option_menu_table?.dash?.position === 'price' && (
                        <hr
                          style={{
                            borderTop: `${option_menu_table.dash.style} ${option_menu_table.dash.style ? price_style.color : ''}`,
                            opacity: 0.5,
                            marginRight: '5px',
                          }}
                        />
                      )}
                      <span
                        className={`${styles.price} ${option_menu_table?.dash?.position === 'price' ? '' : styles.w100}`}
                        style={price_style}
                      >
                        {getLabelPriceUnit(
                          option_menu?.menu_item?.price_unit || '',
                        )}
                        {item.price}
                      </span>
                    </div>
                  </td>
                ) : (
                  option_menu?.menu_item?.price_type_text.map(
                    (price_text, index) => (
                      <td
                        key={index}
                        className="text-line"
                        //style={{ width: `${option_menu_table?.price_w}%` }}
                      >
                        <div className={styles.price_option_row_h}>
                          {index === 0 &&
                          option_menu_table?.dash?.position === 'price' ? (
                            <hr
                              style={{
                                borderTop: `${option_menu_table.dash.style} ${option_menu_table.dash.style ? price_style.color : ''}`,
                                opacity: 0.5,
                                marginRight: '5px',
                              }}
                            />
                          ) : (
                            <></>
                          )}

                          <span
                            className={`${styles.price} `}
                            style={{
                              ...price_style,
                              textAlign: 'center',
                            }}
                          >
                            {price_text}
                          </span>
                          <span
                            className={`${styles.price} `}
                            style={{ ...price_style, marginLeft: '5px' }}
                          >
                            {getLabelPriceUnit(
                              option_menu?.menu_item?.price_unit || '',
                            )}
                            {item.price[index]}
                          </span>
                        </div>
                      </td>
                    ),
                  )
                )}
                {/* ===== //Price ===== */}
              </tr>
              <tr>
                <td style={desc_style}>{item.description}</td>
                {item.calory.length > 0 && price_type === '1' ? (
                  <td
                    colSpan={
                      option_menu?.menu_item?.price_type_text.length || 1
                    }
                    style={calory_style}
                  >
                    {item.calory[0] !== '' ? `${item.calory[0]} kcal` : ''}
                  </td>
                ) : (
                  item.calory.length > 0 &&
                  option_menu?.menu_item?.price_type_text.map((_, index) => (
                    <td key={index} style={{ ...calory_style }}>
                      {item.calory[index] ? `${item.calory[index]} kcal` : ''}
                    </td>
                  ))
                )}
              </tr>
              {((item.allergy && item.allergy != 'none') || item.calory) && (
                <tr>
                  <td colSpan={2} style={allergy_style}>
                    {item.allergy && item.allergy != 'none' && (
                      <>{item.allergy}</>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )
      }
    } else if (menu_type.includes('02') || menu_type.includes('08')) {
      if (option_menu_table?.layout_type === 'H') {
        return (
          <table
            className={styles.tempTable}
            style={{ width: '100%', height: '100%' }}
          >
            <tbody>
              <tr>
                {images.length > 0 && (
                  <td
                    rowSpan={2}
                    className="image-cell"
                    style={{ width: `${images.length > 0 ? '30%' : ''}` }}
                  >
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image.img_url}
                        alt={t('pssc.device.content.thumbnail.alt', {
                          title: image.content_name,
                        })}
                      />
                    ))}
                  </td>
                )}
                {option_menu_table?.dash?.position === 'name' ? (
                  <td
                    className="text-line"
                    style={{
                      width: '70%',
                    }}
                  >
                    <div>
                      <span
                        className={`${styles.menuName} ${option_menu_table?.dash?.position === 'name' ? '' : styles.w100}`}
                        style={name_style}
                      >
                        {/* {item.menu_name} */}
                        {item.menu_name.split('\n').map((line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </span>
                      <hr
                        style={{
                          borderTop: `${option_menu_table.dash.style} ${option_menu_table.dash.style ? name_style.color : ''}`,
                        }}
                      />
                    </div>
                  </td>
                ) : (
                  <td
                    className="text-line"
                    style={{
                      width: '64%',
                      ...name_style,
                    }}
                  >
                    {/* {item.menu_name} */}
                    {item.menu_name.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </td>
                )}

                {/* ===== Price ===== */}
                {price_type === '1' ? (
                  <td className="text-line" style={{ width: 'auto' }}>
                    <div>
                      {option_menu_table?.dash?.position === 'price' && (
                        <hr
                          style={{
                            borderTop: `${option_menu_table.dash.style} ${option_menu_table.dash.style ? price_style.color : ''}`,
                            opacity: 0.5,
                            marginRight: '5px',
                          }}
                        />
                      )}
                      <span
                        className={`${styles.price} ${option_menu_table?.dash?.position === 'price' ? '' : styles.w100}`}
                        style={price_style}
                      >
                        {item.price}
                        {getLabelPriceUnit(
                          option_menu?.menu_item?.price_unit || '',
                        )}
                      </span>
                    </div>
                  </td>
                ) : (
                  option_menu?.menu_item?.price_type_text.map(
                    (price_text, index) =>
                      index === 0 ? (
                        <td
                          key={index}
                          className="text-line"
                          style={{ width: 'auto' }}
                        >
                          <div className={styles.price_option_row_h}>
                            {option_menu_table?.dash?.position === 'price' ? (
                              <hr
                                style={{
                                  borderTop: `${option_menu_table.dash.style} ${option_menu_table.dash.style ? price_style.color : ''}`,
                                  opacity: 0.5,
                                  marginRight: '0.5rem',
                                }}
                              />
                            ) : (
                              <></>
                            )}

                            <span
                              className={`${styles.price} `}
                              style={{
                                ...price_style,
                                textAlign: 'center',
                                marginRight: '0.5rem',
                              }}
                            >
                              {price_text}
                            </span>
                            <span
                              className={`${styles.price} `}
                              style={price_style}
                            >
                              {item.price[0]}
                              {getLabelPriceUnit(
                                option_menu?.menu_item?.price_unit || '',
                              )}
                            </span>
                          </div>
                        </td>
                      ) : null,
                  )
                )}
                {item.calory.length > 0 &&
                  price_type !== '1' &&
                  option_menu?.menu_item?.price_type_text.map((_, index) =>
                    index === 0 ? (
                      <td
                        key={index}
                        style={{ ...calory_style, width: 'auto' }}
                      >
                        {item.calory[index] ? `${item.calory[index]} kcal` : ''}
                      </td>
                    ) : null,
                  )}
              </tr>
              <tr>
                <td style={desc_style}>
                  {item.description}
                  {/* {item.description.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))} */}
                </td>
                {item.calory.length > 0 && price_type === '1' && (
                  <td
                    colSpan={
                      option_menu?.menu_item?.price_type_text.length || 1
                    }
                    style={calory_style}
                  >
                    {item.calory[0] !== '' ? `${item.calory[0]} kcal` : ''}
                  </td>
                )}
                {price_type !== '1' &&
                  option_menu?.menu_item?.price_type_text.map(
                    (price_text, index) =>
                      index === 1 ? (
                        <td
                          key={index}
                          className="text-line"
                          // style={{ width: `${option_menu_table?.price_w}%` }}
                          style={{ width: 'auto' }}
                        >
                          <div className={styles.price_option_row_h}>
                            <span
                              className={`${styles.price} `}
                              style={{
                                ...price_style,
                                textAlign: 'center',
                                marginRight: '0.5rem',
                              }}
                            >
                              {price_text}
                            </span>
                            <span
                              className={`${styles.price} `}
                              style={price_style}
                            >
                              {item.price[1]}
                              {getLabelPriceUnit(
                                option_menu?.menu_item?.price_unit || '',
                              )}
                            </span>
                          </div>
                        </td>
                      ) : null,
                  )}
                {item.calory.length > 0 &&
                  price_type !== '1' &&
                  option_menu?.menu_item?.price_type_text.map((_, index) =>
                    index === 1 ? (
                      <td key={index} style={{ ...calory_style }}>
                        {item.calory[index] ? `${item.calory[index]} kcal` : ''}
                      </td>
                    ) : null,
                  )}
              </tr>
              {((item.allergy && item.allergy != 'none') || item.calory) && (
                <tr>
                  {images.length > 0 && <td></td>}
                  <td style={allergy_style}>
                    {item.allergy && item.allergy != 'none' && (
                      <>{item.allergy}</>
                    )}
                  </td>
                  {price_type !== '1' &&
                    option_menu?.menu_item?.price_type_text.map(
                      (price_text, index) =>
                        index === 2 ? (
                          <td
                            key={index}
                            className="text-line"
                            // style={{ width: `${option_menu_table?.price_w}%` }}
                            style={{ width: 'auto' }}
                          >
                            <div className={styles.price_option_row_h}>
                              <span
                                className={`${styles.price} `}
                                style={{
                                  ...price_style,
                                  textAlign: 'center',
                                  marginRight: '0.5rem',
                                }}
                              >
                                {price_text}
                              </span>
                              <span
                                className={`${styles.price} `}
                                style={price_style}
                              >
                                {item.price[2]}
                                {getLabelPriceUnit(
                                  option_menu?.menu_item?.price_unit || '',
                                )}
                              </span>
                            </div>
                          </td>
                        ) : null,
                    )}
                  {item.calory.length > 0 &&
                    price_type !== '1' &&
                    option_menu?.menu_item?.price_type_text.map((_, index) =>
                      index === 2 ? (
                        <td key={index} style={{ ...calory_style }}>
                          {item.calory[index]
                            ? `${item.calory[index]} kcal`
                            : ''}
                        </td>
                      ) : null,
                    )}
                </tr>
              )}
            </tbody>
          </table>
        )
      } else if (option_menu_table?.layout_type === 'V') {
        return (
          <table
            className={styles.tempTable}
            style={{ width: '100%', height: '100%' }}
          >
            <tbody
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%',
                flexDirection: 'column',
              }}
            >
              <tr>
                {images.length > 0 && (
                  <td
                    rowSpan={3}
                    className="image-cell"
                    style={{ width: `${images.length > 0 ? '20%' : ''}` }}
                  >
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image.img_url}
                        alt={t('pssc.device.content.thumbnail.alt', {
                          title: image.content_name,
                        })}
                      />
                    ))}
                  </td>
                )}
              </tr>
              <tr>
                <td style={name_style}>
                  {item.menu_name.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
              </tr>
              <tr>
                <td style={desc_style}>{item.description}</td>
              </tr>
              {item.allergy && item.allergy != 'none' && (
                <tr>
                  <td style={allergy_style}>{item.allergy}</td>
                </tr>
              )}
              <tr>
                {/* ===== Price ===== */}
                <td>
                  {price_type === '1' ? (
                    <div style={price_style}>
                      {getLabelPriceUnit(
                        option_menu?.menu_item?.price_unit || '',
                      )}
                      {item.price}
                    </div>
                  ) : (
                    option_menu?.menu_item?.price_type_text.map(
                      (price_text, index) => (
                        <div key={index}>
                          <div style={{ ...price_style, width: '20%' }}>
                            {price_text}
                          </div>
                          <div style={price_style}>
                            {getLabelPriceUnit(
                              option_menu?.menu_item?.price_unit || '',
                            )}
                            {item.price[index]}
                          </div>
                        </div>
                      ),
                    )
                  )}
                </td>
                {/* ===== //Price ===== */}
              </tr>
              {item.calory.length > 0 && price_type === '1' ? (
                <tr>
                  <td
                    colSpan={
                      option_menu?.menu_item?.price_type_text.length || 1
                    }
                    style={calory_style}
                  >
                    {item.calory[0] !== '' ? `${item.calory[0]} kcal` : ''}
                  </td>
                </tr>
              ) : (
                <tr>
                  {item.calory.length > 0 &&
                    option_menu?.menu_item?.price_type_text.map((_, index) => (
                      <td key={index} style={{ ...calory_style }}>
                        {item.calory[index] ? `${item.calory[index]} kcal` : ''}
                      </td>
                    ))}
                </tr>
              )}
            </tbody>
          </table>
        )
      }
    } else if (menu_type.includes('04')) {
      if (option_menu_table?.layout_type === 'H') {
        return (
          <table
            className={styles.tempTable}
            style={{ width: '100%', height: '100%' }}
          >
            <tbody>
              <tr>
                <td
                  rowSpan={2}
                  className="image-cell"
                  style={{ width: `${images.length > 0 ? '30%' : ''}` }}
                >
                  {images.length > 0 &&
                    images.map((image, index) => (
                      <img
                        key={index}
                        src={image.img_url}
                        alt={t('pssc.device.content.thumbnail.alt', {
                          title: image.content_name,
                        })}
                      />
                    ))}
                </td>
                {option_menu_table?.dash?.position === 'name' ? (
                  <td
                    className={item.ordr === 1 ? styles.vertical_bottom : ''}
                    style={{
                      width:
                        price_type === '1'
                          ? '80%'
                          : editContent.width > 500
                            ? '70%'
                            : '50%',
                    }}
                  >
                    <div
                      style={{ marginBottom: item.ordr === 1 ? '1rem' : '0' }}
                    >
                      <span
                        className={`${styles.menuName} ${option_menu_table?.dash?.position === 'name' ? '' : styles.w100}`}
                        style={name_style}
                      >
                        {item.menu_name}
                      </span>
                      <hr
                        style={{
                          borderTop: `${option_menu_table.dash.style} ${option_menu_table.dash.style ? name_style.color : ''}`,
                          marginRight: price_type === '1' ? '0' : '1rem',
                        }}
                      />
                    </div>
                  </td>
                ) : (
                  <td
                    // className={item.ordr === 1 ? styles.vertical_bottom : ''}
                    style={{
                      width:
                        price_type === '1'
                          ? '80%'
                          : editContent.width > 500
                            ? '70%'
                            : '50%',
                      marginBottom: item.ordr === 1 ? '1rem' : '0',
                      ...name_style,
                    }}
                  >
                    {item.menu_name}
                  </td>
                )}

                {/* ===== Price ===== */}
                {price_type === '1' ? (
                  <td className="text-line" style={{ width: '20%' }}>
                    <div>
                      {option_menu_table?.dash?.position === 'price' && (
                        <hr
                          style={{
                            borderTop: `${option_menu_table.dash.style} ${option_menu_table.dash.style ? price_style.color : ''}`,
                            opacity: 0.5,
                            marginRight: '5px',
                          }}
                        />
                      )}
                      <span
                        className={`${styles.price} ${option_menu_table?.dash?.position === 'price' ? '' : styles.w100}`}
                        style={price_style}
                      >
                        {getLabelPriceUnit(
                          option_menu?.menu_item?.price_unit || '',
                        )}
                        {item.price}
                      </span>
                    </div>
                  </td>
                ) : (
                  option_menu?.menu_item?.price_type_text.map(
                    (price_text, index) => (
                      <td
                        key={index}
                        className="text-line"
                        //style={{ width: '30%' }}
                      >
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          {index === 0 &&
                          option_menu_table?.dash?.position === 'price' ? (
                            <hr
                              style={{
                                borderTop: `${option_menu_table.dash.style} ${option_menu_table.dash.style ? price_style.color : ''}`,
                                opacity: 0.5,
                                marginRight: '5px',
                              }}
                            />
                          ) : (
                            <></>
                          )}
                          {item.ordr === 1 ? (
                            <span
                              className={`${styles.price} ${option_menu_table?.dash?.position === 'price' ? '' : styles.w100}`}
                              style={{
                                ...price_style,
                                textAlign: 'center',
                              }}
                            >
                              {price_text}
                            </span>
                          ) : null}

                          <span
                            className={`${styles.price} ${option_menu_table?.dash?.position === 'price' ? '' : styles.w100} ${styles.text_align_center}`}
                            style={{ ...price_style }}
                          >
                            {getLabelPriceUnit(
                              option_menu?.menu_item?.price_unit || '',
                            )}
                            {item.price[index]}
                          </span>
                          {item.calory.length > 0 && (
                            <span key={index} style={{ ...calory_style }}>
                              {item.calory[index]
                                ? `${item.calory[index]} kcal`
                                : ''}
                            </span>
                          )}
                        </div>
                      </td>
                    ),
                  )
                )}
                {/* ===== //Price ===== */}
              </tr>
              <tr>
                <td colSpan={price_type === '1' ? 1 : 4} style={desc_style}>
                  {item.description}
                </td>
                {item.calory.length > 0 && price_type === '1' && (
                  <td style={calory_style}>
                    {item.calory[0] !== '' ? `${item.calory[0]} kcal` : ''}
                  </td>
                )}
              </tr>
              {((item.allergy && item.allergy != 'none') || item.calory) && (
                <tr>
                  <td></td>
                  <td colSpan={4} style={allergy_style}>
                    {item.allergy && item.allergy != 'none' && (
                      <>{item.allergy}</>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )
      }
    } else if (
      menu_type.includes('07') ||
      menu_type.includes('10') ||
      menu_type.includes('11')
    ) {
      if (option_menu_table?.layout_type === 'H') {
        return (
          <table
            className={`${styles.tempTable}`}
            style={{ width: '100%', height: '100%' }}
          >
            <tbody>
              <tr>
                <td
                  rowSpan={2}
                  className="image-cell"
                  style={{ width: `${images.length > 0 ? '30%' : ''}` }}
                >
                  {images.length > 0 &&
                    images.map((image, index) => (
                      <img
                        key={index}
                        src={image.img_url}
                        alt={t('pssc.device.content.thumbnail.alt', {
                          title: image.content_name,
                        })}
                      />
                    ))}
                </td>
                {option_menu_table?.dash?.position === 'name' ? (
                  <td
                    //className={styles.vertical_bottom}
                    style={{ width: price_type === '1' ? '80%' : '70%' }}
                  >
                    <div>
                      <span
                        className={`${styles.menuName} ${option_menu_table?.dash?.position === 'name' ? '' : styles.w100}`}
                        style={name_style}
                      >
                        {item.menu_name}
                      </span>
                      <hr
                        style={{
                          borderTop: `${option_menu_table.dash.style} ${option_menu_table.dash.style ? name_style.color : ''}`,
                        }}
                      />
                    </div>
                  </td>
                ) : (
                  <td
                    className={styles.vertical_bottom}
                    style={{
                      width: menu_type.includes('07')
                        ? 'auto'
                        : price_type === '1'
                          ? '80%'
                          : editContent.width > 500
                            ? '68%'
                            : '50%',
                      ...name_style,
                    }}
                  >
                    {item.menu_name}
                  </td>
                )}
                {option_menu_table?.dash?.position === 'price' &&
                  price_type !== '1' && (
                    <td>
                      <hr
                        style={{
                          ...(item.ordr === 1
                            ? {
                                borderBottom: `${option_menu_table.dash.style} ${
                                  option_menu_table.dash.style
                                    ? price_style.color
                                    : ''
                                }`,
                              }
                            : {
                                borderTop: `${option_menu_table.dash.style} ${
                                  option_menu_table.dash.style
                                    ? price_style.color
                                    : ''
                                }`,
                              }),
                          opacity: 0.5,
                          marginRight: '5px',
                          height: item.ordr === 1 ? '100%' : '',
                          marginBottom: item.ordr === 1 ? '1.5rem' : '0',
                        }}
                      />
                    </td>
                  )}
                {/* ===== Price ===== */}
                {price_type === '1' ? (
                  <td className="text-line" style={{ width: 'auto' }}>
                    <div>
                      {option_menu_table?.dash?.position === 'price' && (
                        <hr
                          style={{
                            borderTop: `${option_menu_table.dash.style} ${option_menu_table.dash.style ? price_style.color : ''}`,
                            opacity: 0.5,
                            marginRight: '5px',
                          }}
                        />
                      )}
                      <span
                        className={`${styles.price} ${option_menu_table?.dash?.position === 'price' ? '' : styles.w100}`}
                        style={price_style}
                      >
                        {getLabelPriceUnit(
                          option_menu?.menu_item?.price_unit || '',
                        )}
                        {item.price}
                      </span>
                    </div>
                  </td>
                ) : (
                  option_menu?.menu_item?.price_type_text.map(
                    (price_text, index) => (
                      <td
                        key={index}
                        className="text-line"
                        style={{
                          width: 'auto',
                          verticalAlign: item.ordr === 1 ? 'bottom' : 'middle',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          {/* {item.ordr === 1 &&
                          option_menu_table?.dash?.position === 'price' ? (
                            <hr
                              style={{
                                borderTop: `${option_menu_table.dash.style} ${option_menu_table.dash.style ? price_style.color : ''}`,
                                opacity: 0.5,
                                marginRight: '5px',
                              }}
                            />
                          ) : (
                            <></>
                          )} */}

                          {item.ordr === 1 ? (
                            <span
                              className={`${styles.price} ${option_menu_table?.dash?.position === 'price' ? '' : styles.w100}`}
                              style={{
                                ...price_style,
                                textAlign: 'center',
                              }}
                            >
                              {price_text}
                            </span>
                          ) : null}
                          <span
                            className={`${styles.price} ${option_menu_table?.dash?.position === 'price' ? '' : styles.w100}`}
                            style={{ ...price_style, textAlign: 'center' }}
                          >
                            {getLabelPriceUnit(
                              option_menu?.menu_item?.price_unit || '',
                            )}
                            {item.price[index]}
                          </span>
                        </div>
                      </td>
                    ),
                  )
                )}
                {/* ===== //Price ===== */}
              </tr>
              <tr>
                {!menu_type.includes('07') && (
                  <td style={desc_style}>{item.description}</td>
                )}
                {menu_type.includes('07') &&
                  ((item.allergy && item.allergy != 'none') || item.calory) && (
                    <>
                      <td style={allergy_style}>
                        {item.allergy && item.allergy != 'none' && (
                          <>{item.allergy}</>
                        )}
                      </td>
                      {price_type !== '1' && <td style={{ width: '7%' }}></td>}
                    </>
                  )}

                {item.calory.length > 0 && price_type === '1' ? (
                  <td
                    colSpan={
                      option_menu?.menu_item?.price_type_text.length || 1
                    }
                    style={calory_style}
                  >
                    {item.calory[0] !== '' ? `${item.calory[0]} kcal` : ''}
                  </td>
                ) : (
                  item.calory.length > 0 &&
                  option_menu?.menu_item?.price_type_text.map((_, index) => (
                    <td
                      key={index}
                      style={{ ...calory_style, textAlign: 'center' }}
                    >
                      {item.calory[index] ? `${item.calory[index]} kcal` : ''}
                    </td>
                  ))
                )}
              </tr>
              {!menu_type.includes('07') &&
                ((item.allergy && item.allergy != 'none') || item.calory) && (
                  <tr>
                    <td></td>
                    <td style={allergy_style}>
                      {item.allergy && item.allergy != 'none' && (
                        <>{item.allergy}</>
                      )}
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        )
      }
    } else if (menu_type.includes('03')) {
      if (option_menu_table?.layout_type === 'V') {
        return (
          <table
            className={styles.tempTable_03}
            style={{ width: '100%', height: '100%' }}
          >
            <tbody
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                height: '100%',
                flexDirection: 'column',
              }}
            >
              <tr>
                {images.length > 0 && (
                  <td
                    rowSpan={3}
                    className="image-cell"
                    style={{ width: `${images.length > 0 ? '20%' : ''}` }}
                  >
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image.img_url}
                        alt={t('pssc.device.content.thumbnail.alt', {
                          title: image.content_name,
                        })}
                      />
                    ))}
                  </td>
                )}
              </tr>
              <tr>
                <td style={name_style}>
                  {item.menu_name.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
              </tr>
              <tr>
                <td style={desc_style}>{item.description}</td>
              </tr>
              {item.allergy && item.allergy != 'none' && (
                <tr>
                  <td style={allergy_style}>{item.allergy}</td>
                </tr>
              )}
              <tr>
                {/* ===== Price ===== */}
                <td>
                  <div style={{ gap: '14px' }}>
                    {price_type === '1' ? (
                      <>
                        <div style={price_style}>
                          {getLabelPriceUnit(
                            option_menu?.menu_item?.price_unit || '',
                          )}
                          {item.price}
                        </div>
                        {item.calory.length > 0 && (
                          <div style={calory_style}>
                            /
                            {item.calory[0] !== ''
                              ? `${item.calory[0]} kcal`
                              : ''}
                          </div>
                        )}
                      </>
                    ) : (
                      option_menu?.menu_item?.price_type_text.map(
                        (price_text, index) => (
                          <div key={index} style={{ gap: '6px' }}>
                            <div style={{ ...price_style, width: '20%' }}>
                              {price_text}
                            </div>
                            <div style={price_style}>
                              {getLabelPriceUnit(
                                option_menu?.menu_item?.price_unit || '',
                              )}
                              {item.price[index]}
                            </div>

                            {item.calory.length > 0 && (
                              <div key={index} style={{ ...calory_style }}>
                                {item.calory[index]
                                  ? `/${item.calory[index]} kcal`
                                  : ''}
                              </div>
                            )}
                          </div>
                        ),
                      )
                    )}
                  </div>
                </td>
                {/* ===== //Price ===== */}
              </tr>
            </tbody>
          </table>
        )
      }
    } else if (menu_type.includes('05')) {
      if (option_menu_table?.layout_type === 'V') {
        return (
          <table
            className={styles.tempTable}
            style={{ width: '100%', height: '100%' }}
          >
            <tbody
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                height: '100%',
                flexDirection: 'column',
              }}
            >
              <tr>
                {images.length > 0 && (
                  <td
                    rowSpan={3}
                    className="image-cell"
                    style={{ width: `${images.length > 0 ? '20%' : ''}` }}
                  >
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image.img_url}
                        alt={t('pssc.device.content.thumbnail.alt', {
                          title: image.content_name,
                        })}
                      />
                    ))}
                  </td>
                )}
              </tr>
              <tr>
                <td style={name_style}>
                  {item.menu_name.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
              </tr>
              <tr>
                <td style={desc_style}>{item.description}</td>
              </tr>
              {item.allergy && item.allergy != 'none' && (
                <tr>
                  <td style={allergy_style}>{item.allergy}</td>
                </tr>
              )}
              <tr>
                {/* ===== Price ===== */}
                <td>
                  <div style={{ gap: '14px' }}>
                    {price_type === '1' ? (
                      <>
                        <div style={price_style}>
                          {getLabelPriceUnit(
                            option_menu?.menu_item?.price_unit || '',
                          )}
                          {item.price}
                        </div>
                        {item.calory.length > 0 && (
                          <div style={calory_style}>
                            {item.calory[0] !== ''
                              ? `${item.calory[0]} kcal`
                              : ''}
                          </div>
                        )}
                      </>
                    ) : (
                      option_menu?.menu_item?.price_type_text.map(
                        (price_text, index) => (
                          <div key={index} className={styles.price_option_col}>
                            <div>
                              <span style={{ ...price_style }}>
                                {price_text}
                              </span>
                              <span
                                style={{ ...price_style, marginLeft: '0.5rem' }}
                              >
                                {getLabelPriceUnit(
                                  option_menu?.menu_item?.price_unit || '',
                                )}
                                {item.price[index]}
                              </span>
                            </div>
                            {item.calory.length > 0 && (
                              <span key={index} style={{ ...calory_style }}>
                                {item.calory[index]
                                  ? `${item.calory[index]} kcal`
                                  : ''}
                              </span>
                            )}
                          </div>
                        ),
                      )
                    )}
                  </div>
                </td>
                {/* ===== //Price ===== */}
              </tr>
            </tbody>
          </table>
        )
      }
    } else if (menu_type.includes('06')) {
      if (option_menu_table?.layout_type === 'V') {
        return (
          <table
            className={styles.tempTable}
            style={{ width: '100%', height: '100%' }}
          >
            <tbody
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%',
                flexDirection: 'column',
              }}
            >
              <tr>
                {images.length > 0 && (
                  <td
                    rowSpan={3}
                    className="image-cell"
                    style={{ width: `${images.length > 0 ? '20%' : ''}` }}
                  >
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image.img_url}
                        alt={t('pssc.device.content.thumbnail.alt', {
                          title: image.content_name,
                        })}
                      />
                    ))}
                  </td>
                )}
              </tr>
              <tr>
                <td style={name_style}>
                  {item.menu_name.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
              </tr>
              <tr>
                <td style={desc_style}>{item.description}</td>
              </tr>

              <tr>
                {/* ===== Price ===== */}
                <td>
                  <div style={{ gap: '14px' }}>
                    {price_type === '1' ? (
                      <>
                        <div style={price_style}>
                          {getLabelPriceUnit(
                            option_menu?.menu_item?.price_unit || '',
                          )}
                          {item.price}
                        </div>
                        {item.calory.length > 0 && (
                          <div style={calory_style}>
                            {item.calory[0] !== ''
                              ? `${item.calory[0]} kcal`
                              : ''}
                          </div>
                        )}
                      </>
                    ) : (
                      option_menu?.menu_item?.price_type_text.map(
                        (price_text, index) => (
                          <div key={index} className={styles.price_option_col}>
                            <div>
                              <span style={{ ...price_style }}>
                                {price_text}
                              </span>
                              <span
                                style={{ ...price_style, marginLeft: '0.5rem' }}
                              >
                                {getLabelPriceUnit(
                                  option_menu?.menu_item?.price_unit || '',
                                )}
                                {item.price[index]}
                              </span>
                            </div>
                            {item.calory.length > 0 && (
                              <span key={index} style={{ ...calory_style }}>
                                {item.calory[index]
                                  ? `${item.calory[index]} kcal`
                                  : ''}
                              </span>
                            )}
                          </div>
                        ),
                      )
                    )}
                  </div>
                </td>
                {/* ===== //Price ===== */}
              </tr>
              {item.allergy && item.allergy != 'none' && (
                <tr>
                  <td style={allergy_style}>{item.allergy}</td>
                </tr>
              )}
            </tbody>
          </table>
        )
      }
    } else if (menu_type.includes('09')) {
      if (option_menu_table?.layout_type === 'V') {
        return (
          <table
            className={styles.tempTable}
            style={{ width: '100%', height: '100%' }}
          >
            <tbody
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%',
                flexDirection: 'column',
              }}
            >
              <tr>
                {images.length > 0 && (
                  <td
                    rowSpan={3}
                    className="image-cell"
                    style={{ width: `${images.length > 0 ? '20%' : ''}` }}
                  >
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image.img_url}
                        alt={t('pssc.device.content.thumbnail.alt', {
                          title: image.content_name,
                        })}
                      />
                    ))}
                  </td>
                )}
              </tr>
              <tr>
                <td style={name_style}>
                  {item.menu_name.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
              </tr>
              <tr>
                <td style={desc_style}>{item.description}</td>
              </tr>
              {item.allergy && item.allergy != 'none' && (
                <tr>
                  <td style={allergy_style}>{item.allergy}</td>
                </tr>
              )}
              {/* {item.ordr === 3 && (
                <tr>
                  <td>
                    <div
                      className={`${styles.price_option_row} ${styles.price_calorie_divider}`}
                    >
                      {price_type === '1' && (
                        <span style={price_style}>
                          {getLabelPriceUnit(
                            option_menu?.menu_item?.price_unit || '',
                          )}
                          {item.price}
                        </span>
                      )}
                      <span className={styles.line}></span>
                      {item.calory.length > 0 && price_type === '1' && (
                        <span style={calory_style}>
                          {item.calory[0] !== ''
                            ? `${item.calory[0]} kcal`
                            : ''}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              )} */}
            </tbody>
          </table>
        )
      }
    }
  }

  const getRows = () => {
    const rows: OptionMenuItemState[][] = []
    for (let i = 0; i < menu_list.length; i += parseInt(menu_column)) {
      rows.push(menu_list.slice(i, i + parseInt(menu_column)))
    }
    return rows
  }

  return (
    <>
      <DraggableResizable
        id={id}
        selectedId={id}
        draggableYN={!isMasterLock}
        resizableYN={!isMasterLock}
        scalableYN={false}
        parentRef={parentRef}
        isPreview={isMasterLock || isPreview}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <table
            className={styles.parentTbl}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}
          >
            <tbody>
              {getRows().map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((item, colIndex) => (
                    <td key={colIndex} className={styles.pb10}>
                      {renderTable(item)}
                    </td>
                  ))}
                </tr>
              ))}
              {menu_type.includes('09') && (
                <tr style={{ display: 'flex', justifyContent: 'center' }}>
                  {getRows().map((row, rowIndex) => (
                    <td key={rowIndex}>
                      {row.map((item) => (
                        <div
                          className={`${styles.price_option_row_v} ${styles.price_calorie_divider}`}
                        >
                          <span style={price_style}>
                            {getLabelPriceUnit(
                              option_menu?.menu_item?.price_unit || '',
                            )}
                            {item.price}
                          </span>
                          <span className={styles.line}></span>
                          {item.calory.length > 0 && (
                            <span style={calory_style}>
                              {item.calory[0] !== ''
                                ? `${item.calory[0]} kcal`
                                : ''}
                            </span>
                          )}
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DraggableResizable>
    </>
  )
}
export default MenuItem
