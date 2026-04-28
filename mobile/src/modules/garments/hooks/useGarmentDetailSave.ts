import { QueryObserverResult } from '@tanstack/react-query'
import { CompleteGarment } from '@/core/api/garment/models/CompleteGarment'
import { PatchGarmentRequest } from '@/core/api/garment/models/PatchGarmentRequest'
import { ConfigItem } from '@/core/api/garment/models/GarmentConfigs'
import { usePatchGarment } from '@/core/query/garment'
import {
  normalizeId,
  resolveDraftColorIds,
  resolveDraftConfigId,
} from '@/modules/garments/utils/garmentDetail.utils'
import { showGlobalApiError } from '@/shared/components/layout/ErrorBoundary'

type GarmentDetailSaveFormState = {
  nameValue: string
  categoryId: string
  styleId: string
  colorIds: string[]
  brandId: string
  draftName: string
  draftCategoryId: string
  draftStyleId: string
  draftColorIds: string[]
  draftBrandId: string
  setDraftBrandId: (id: string) => void
  setIsEditing: (isEditing: boolean) => void
  hydrateFromGarment: (garment: CompleteGarment) => void
  commitDraftToCurrent: (options?: { nameOverride?: string }) => void
}

type UseGarmentDetailSaveParams = {
  garmentId: string
  categories: ConfigItem[]
  styles: ConfigItem[]
  colors: ConfigItem[]
  brands: ConfigItem[]
  form: GarmentDetailSaveFormState
  refetchGarment: () => Promise<QueryObserverResult<CompleteGarment, Error>>
  unknownErrorMessage: string
}

export const useGarmentDetailSave = ({
  garmentId,
  categories,
  styles,
  colors,
  brands,
  form,
  refetchGarment,
  unknownErrorMessage,
}: UseGarmentDetailSaveParams) => {
  const { mutateAsync: patchGarment, isPending: isSaving } = usePatchGarment()

  const handleSave = async () => {
    const normalizedName = form.draftName.trim()
    if (!normalizedName || !garmentId) {
      return
    }

    try {
      const patch: PatchGarmentRequest & {
        category?: string | null
        style?: string | null
        colors?: string[]
        brand?: string | null
      } = {
        name: normalizedName,
        category: form.draftCategoryId || null,
        style: form.draftStyleId || null,
        colors: form.draftColorIds,
        brand: form.draftBrandId || null,
        status: 'CONFIRMED',
      }

      const resolvedDraftCategoryId = resolveDraftConfigId(form.draftCategoryId, categories)
      const resolvedDraftStyleId = resolveDraftConfigId(form.draftStyleId, styles)
      const resolvedDraftColorIds = resolveDraftColorIds(form.draftColorIds, colors)

      const resolvedCurrentCategoryId = resolveDraftConfigId(form.categoryId, categories)
      const resolvedCurrentStyleId = resolveDraftConfigId(form.styleId, styles)
      const resolvedCurrentColorIds = resolveDraftColorIds(form.colorIds, colors)
      const resolvedBrandId = resolveDraftConfigId(form.draftBrandId, brands)

      const draftColorIdsKey = resolvedDraftColorIds.join('|')
      const currentColorIdsKey = resolvedCurrentColorIds.join('|')
      const hasCategoryChanged = (resolvedDraftCategoryId ?? '') !== (resolvedCurrentCategoryId ?? '')
      const hasStyleChanged = (resolvedDraftStyleId ?? '') !== (resolvedCurrentStyleId ?? '')
      const hasColorsChanged = draftColorIdsKey !== currentColorIdsKey

      if (!hasCategoryChanged) {
        delete patch.category
      }

      if (!hasStyleChanged) {
        delete patch.style
      }

      if (!hasColorsChanged) {
        delete patch.colors
      }

      if (resolvedBrandId === normalizeId(form.brandId)) {
        delete patch.brand
      }

      if (normalizedName === form.nameValue.trim()) {
        delete patch.name
      }

      if (Object.keys(patch).length === 1 && patch.status) {
        form.setIsEditing(false)
        return
      }

      await patchGarment({
        id: garmentId,
        patch,
      })

      const refreshedGarment = await refetchGarment()
      const latestGarment = refreshedGarment.data

      if (latestGarment) {
        form.hydrateFromGarment(latestGarment)
      } else {
        form.commitDraftToCurrent({ nameOverride: normalizedName })
        form.setDraftBrandId(resolvedBrandId ?? '')
      }

      form.setIsEditing(false)
    } catch (error) {
      const parsedError = error instanceof Error ? error : new Error(unknownErrorMessage)
      showGlobalApiError(parsedError)
    }
  }

  return {
    handleSave,
    isSaving,
  }
}
